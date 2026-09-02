import os
import io
import fitz  # PyMuPDF
from PIL import Image
from typing import List, Dict, Optional

class SecurityService:
    @staticmethod
    def unlock_pdf(input_path: str, output_path: str, password: str = "") -> str:
        """Unlock an encrypted PDF by verifying password and removing security restriction."""
        doc = fitz.open(input_path)
        if doc.is_encrypted:
            authenticated = doc.authenticate(password)
            if not authenticated:
                doc.close()
                raise ValueError("Password PDF salah atau tidak valid.")
                
        doc.save(output_path, encryption=fitz.PDF_ENCRYPT_NONE)
        doc.close()
        return output_path

    @staticmethod
    def protect_pdf(
        input_path: str,
        output_path: str,
        user_password: str,
        owner_password: Optional[str] = None,
        allow_print: bool = True,
        allow_copy: bool = True
    ) -> str:
        """
        Encrypt PDF with user and owner passwords and set permissions.
        """
        if not user_password:
            raise ValueError("Password pengguna wajib diisi.")
            
        owner_pwd = owner_password or (user_password + "_owner")
        doc = fitz.open(input_path)
        
        # Calculate permission flags
        permissions = fitz.PDF_PERM_ACCESSIBILITY
        if allow_print:
            permissions |= fitz.PDF_PERM_PRINT
        if allow_copy:
            permissions |= fitz.PDF_PERM_COPY
            
        doc.save(
            output_path,
            encryption=fitz.PDF_ENCRYPT_AES_256,
            user_pw=user_password,
            owner_pw=owner_pwd,
            permissions=permissions
        )
        doc.close()
        return output_path

    @staticmethod
    def sign_pdf(
        input_path: str,
        output_path: str,
        signature_image_path: Optional[str] = None,
        signature_text: Optional[str] = None,
        page_number: int = 1,
        x: float = 100,
        y: float = 650,
        width: float = 180,
        height: float = 70
    ) -> str:
        """
        Stamp digital signature image or formal signature block onto PDF.
        page_number is 1-indexed.
        """
        doc = fitz.open(input_path)
        total_pages = len(doc)
        target_idx = max(0, min(total_pages - 1, page_number - 1))
        page = doc[target_idx]
        
        rect = fitz.Rect(x, y, x + width, y + height)
        
        if signature_image_path and os.path.exists(signature_image_path):
            page.insert_image(rect, filename=signature_image_path, keep_proportion=True)
        elif signature_text:
            # Draw a signature box with nice styling
            page.draw_rect(rect, color=(0.15, 0.38, 0.92), width=1.5)
            # Add text inside
            import datetime
            now_str = datetime.datetime.now().strftime("%d-%m-%Y %H:%M WIB")
            text = f"Signed Digitally By:\n{signature_text}\nDate: {now_str}\nVerified by ChangeFilePDF"
            page.insert_textbox(rect, text, fontsize=9, color=(0.1, 0.1, 0.2), align=fitz.TEXT_ALIGN_CENTER)
            
        doc.save(output_path)
        doc.close()
        return output_path

    @staticmethod
    def watermark_pdf(
        input_path: str,
        output_path: str,
        watermark_text: str = "CONFIDENTIAL",
        opacity: float = 0.25,
        angle: int = 45,
        font_size: int = 48,
        color_hex: str = "#64748B"
    ) -> str:
        """
        Apply a diagonal or horizontal watermark text across all pages.
        """
        doc = fitz.open(input_path)
        
        # Parse hex color
        hex_clean = color_hex.lstrip("#")
        if len(hex_clean) == 6:
            r = int(hex_clean[0:2], 16) / 255.0
            g = int(hex_clean[2:4], 16) / 255.0
            b = int(hex_clean[4:6], 16) / 255.0
        else:
            r, g, b = (0.39, 0.45, 0.55)
            
        for page in doc:
            rect = page.rect
            center_x = rect.width / 2
            center_y = rect.height / 2
            
            # Using PyMuPDF insert_text or draw with rotation
            # Page.insert_text supports morph=(fixpoint, matrix) for rotation
            mat = fitz.Matrix(angle)
            point = fitz.Point(center_x - len(watermark_text) * (font_size * 0.28), center_y)
            
            # Insert watermark with transparency
            page.insert_text(
                point,
                watermark_text,
                fontsize=font_size,
                color=(r, g, b),
                morph=(point, mat),
                stroke_opacity=opacity,
                fill_opacity=opacity
            )
            
        doc.save(output_path)
        doc.close()
        return output_path

    @staticmethod
    def redact_pdf(
        input_path: str,
        output_path: str,
        search_terms: Optional[List[str]] = None,
        redact_rects: Optional[List[Dict[str, float]]] = None,
        page_number: Optional[int] = None
    ) -> str:
        """
        Redact / blackout sensitive data from PDF pages.
        """
        doc = fitz.open(input_path)
        
        # 1. Redact by text search keywords
        if search_terms:
            for term in search_terms:
                if not term.strip():
                    continue
                for page in doc:
                    text_instances = page.search_for(term.strip())
                    for inst in text_instances:
                        page.add_redact_annot(inst, fill=(0, 0, 0))
                    page.apply_redactions()
                    
        # 2. Redact by specific rectangular boxes
        if redact_rects:
            for item in redact_rects:
                p_idx = item.get("page", 1) - 1
                if 0 <= p_idx < len(doc):
                    page = doc[p_idx]
                    rect = fitz.Rect(item["x"], item["y"], item["x"] + item["width"], item["y"] + item["height"])
                    page.add_redact_annot(rect, fill=(0, 0, 0))
                    page.apply_redactions()
                    
        doc.save(output_path, garbage=3, deflate=True)
        doc.close()
        return output_path

    @staticmethod
    def fill_form_pdf(input_path: str, output_path: str, field_data: Dict[str, str], flatten: bool = False) -> str:
        """
        Fill AcroForm fields in PDF with provided dictionary of key-value pairs.
        """
        doc = fitz.open(input_path)
        for page in doc:
            for widget in page.widgets():
                if widget.field_name in field_data:
                    widget.field_value = str(field_data[widget.field_name])
                    widget.update()
                    
        if flatten:
            # Flatten widgets into regular vector content
            for page in doc:
                page.clean_contents()
                
        doc.save(output_path)
        doc.close()
        return output_path

    @staticmethod
    def get_form_fields(input_path: str) -> List[Dict[str, str]]:
        """List all form fields available in a PDF."""
        doc = fitz.open(input_path)
        fields = []
        for i, page in enumerate(doc):
            for widget in page.widgets():
                fields.append({
                    "page": i + 1,
                    "name": widget.field_name or f"field_{widget.xref}",
                    "type": widget.field_type_string,
                    "value": widget.field_value or ""
                })
        doc.close()
        return fields
