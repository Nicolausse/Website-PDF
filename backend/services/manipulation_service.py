import os
import fitz  # PyMuPDF
from typing import List, Optional

class ManipulationService:
    @staticmethod
    def merge_pdfs(input_paths: List[str], output_path: str) -> str:
        """Merge multiple PDF files into one output PDF."""
        result_doc = fitz.open()
        for pdf_path in input_paths:
            doc = fitz.open(pdf_path)
            result_doc.insert_pdf(doc)
            doc.close()
            
        result_doc.save(output_path, garbage=3, deflate=True)
        result_doc.close()
        return output_path

    @staticmethod
    def split_pdf(input_path: str, output_dir: str, page_ranges: Optional[str] = None, split_every_page: bool = False) -> List[str]:
        """
        Split a PDF document into multiple PDFs.
        page_ranges format: '1-3, 5, 7-9' (1-indexed)
        """
        doc = fitz.open(input_path)
        total_pages = len(doc)
        output_files = []
        
        if split_every_page or not page_ranges:
            for i in range(total_pages):
                out_doc = fitz.open()
                out_doc.insert_pdf(doc, from_page=i, to_page=i)
                out_file = os.path.join(output_dir, f"halaman_{i+1:03d}.pdf")
                out_doc.save(out_file)
                out_doc.close()
                output_files.append(out_file)
        else:
            ranges = [r.strip() for r in page_ranges.split(",") if r.strip()]
            for idx, r in enumerate(ranges):
                out_doc = fitz.open()
                if "-" in r:
                    parts = r.split("-")
                    start = max(1, int(parts[0])) - 1
                    end = min(total_pages, int(parts[1])) - 1
                    if start <= end:
                        out_doc.insert_pdf(doc, from_page=start, to_page=end)
                else:
                    page_num = int(r) - 1
                    if 0 <= page_num < total_pages:
                        out_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
                        
                if len(out_doc) > 0:
                    out_file = os.path.join(output_dir, f"bagian_{idx+1}_{r}.pdf")
                    out_doc.save(out_file)
                    out_doc.close()
                    output_files.append(out_file)
                    
        doc.close()
        return output_files

    @staticmethod
    def compress_pdf(input_path: str, output_path: str, level: str = "medium") -> str:
        """
        Compress PDF file.
        level: 'low' (slight compression, high quality), 'medium' (balanced), 'high' (extreme compression)
        """
        doc = fitz.open(input_path)
        
        dpi_map = {"low": 150, "medium": 100, "high": 72}
        quality_map = {"low": 85, "medium": 65, "high": 40}
        target_dpi = dpi_map.get(level, 100)
        target_quality = quality_map.get(level, 65)
        
        # Optimize embedded images
        for page in doc:
            img_list = page.get_images(full=True)
            for img_info in img_list:
                xref = img_info[0]
                base_img = doc.extract_image(xref)
                if base_img:
                    image_bytes = base_img["image"]
                    import io
                    from PIL import Image
                    try:
                        pil_img = Image.open(io.BytesIO(image_bytes))
                        if pil_img.mode in ("RGBA", "P"):
                            pil_img = pil_img.convert("RGB")
                        
                        # Resize if too large
                        max_dim = 1600 if level == "low" else (1200 if level == "medium" else 800)
                        if max(pil_img.size) > max_dim:
                            pil_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                            
                        compressed_io = io.BytesIO()
                        pil_img.save(compressed_io, format="JPEG", quality=target_quality, optimize=True)
                        doc.update_stream(xref, compressed_io.getvalue())
                    except Exception:
                        pass
                        
        doc.save(
            output_path,
            garbage=4,
            deflate=True,
            clean=True,
            deflate_images=True,
            deflate_fonts=True
        )
        doc.close()
        return output_path

    @staticmethod
    def rotate_pdf(input_path: str, output_path: str, angle: int = 90, pages: str = "all") -> str:
        """
        Rotate pages in PDF.
        angle: 90, 180, 270
        pages: 'all' or comma-separated page numbers '1, 3, 5'
        """
        doc = fitz.open(input_path)
        total_pages = len(doc)
        
        target_pages = set()
        if pages == "all" or not pages:
            target_pages = set(range(total_pages))
        else:
            for p in pages.split(","):
                p_str = p.strip()
                if p_str.isdigit():
                    num = int(p_str) - 1
                    if 0 <= num < total_pages:
                        target_pages.add(num)
                        
        for page_num in target_pages:
            page = doc[page_num]
            current_rotation = page.rotation
            page.set_rotation((current_rotation + angle) % 360)
            
        doc.save(output_path)
        doc.close()
        return output_path

    @staticmethod
    def organize_pdf(input_path: str, output_path: str, page_order: Optional[List[int]] = None, pages_to_delete: Optional[List[int]] = None) -> str:
        """
        Organize, reorder, or remove pages from PDF.
        page_order: 1-indexed list of desired page sequence, e.g. [3, 1, 2]
        pages_to_delete: 1-indexed list of pages to remove, e.g. [2, 4]
        """
        doc = fitz.open(input_path)
        total_pages = len(doc)
        
        if page_order:
            # Convert 1-indexed to 0-indexed and validate
            valid_order = [p - 1 for p in page_order if 1 <= p <= total_pages]
            doc.select(valid_order)
        elif pages_to_delete:
            delete_set = set(p - 1 for p in pages_to_delete if 1 <= p <= total_pages)
            keep_order = [i for i in range(total_pages) if i not in delete_set]
            if not keep_order:
                raise ValueError("Tidak dapat menghapus semua halaman.")
            doc.select(keep_order)
            
        doc.save(output_path, garbage=3, deflate=True)
        doc.close()
        return output_path

    @staticmethod
    def crop_pdf(input_path: str, output_path: str, left_margin: float = 20, top_margin: float = 20, right_margin: float = 20, bottom_margin: float = 20) -> str:
        """Crop margins of all pages in PDF."""
        doc = fitz.open(input_path)
        for page in doc:
            rect = page.rect
            new_rect = fitz.Rect(
                rect.x0 + left_margin,
                rect.y0 + top_margin,
                rect.x1 - right_margin,
                rect.y1 - bottom_margin
            )
            # Ensure crop box is valid
            if new_rect.x1 > new_rect.x0 and new_rect.y1 > new_rect.y0:
                page.set_cropbox(new_rect)
                
        doc.save(output_path)
        doc.close()
        return output_path

    @staticmethod
    def add_page_numbers(
        input_path: str,
        output_path: str,
        position: str = "bottom_center",
        format_type: str = "Halaman {n} dari {total}",
        font_size: int = 10,
        start_number: int = 1,
        color_hex: str = "#475569"
    ) -> str:
        """
        Add page numbers to PDF.
        position: 'bottom_center', 'bottom_right', 'bottom_left', 'top_center', 'top_right'
        """
        doc = fitz.open(input_path)
        total_pages = len(doc)
        
        # Parse hex color
        hex_val = color_hex.lstrip("#")
        if len(hex_val) == 6:
            r = int(hex_val[0:2], 16) / 255.0
            g = int(hex_val[2:4], 16) / 255.0
            b = int(hex_val[4:6], 16) / 255.0
            font_color = (r, g, b)
        else:
            font_color = (0.28, 0.33, 0.41)
            
        for i, page in enumerate(doc):
            curr_num = i + start_number
            if "{total}" in format_type:
                text = format_type.replace("{n}", str(curr_num)).replace("{total}", str(total_pages))
            elif "{n}" in format_type:
                text = format_type.replace("{n}", str(curr_num))
            else:
                text = f"{curr_num}"
                
            rect = page.rect
            margin_x = 40
            margin_y = 30
            
            # Determine placement coordinates
            if position == "bottom_right":
                p_point = fitz.Point(rect.width - margin_x - len(text) * (font_size * 0.5), rect.height - margin_y)
            elif position == "bottom_left":
                p_point = fitz.Point(margin_x, rect.height - margin_y)
            elif position == "top_center":
                p_point = fitz.Point(rect.width / 2 - (len(text) * font_size * 0.25), margin_y + font_size)
            elif position == "top_right":
                p_point = fitz.Point(rect.width - margin_x - len(text) * (font_size * 0.5), margin_y + font_size)
            else:  # bottom_center
                p_point = fitz.Point(rect.width / 2 - (len(text) * font_size * 0.25), rect.height - margin_y)
                
            page.insert_text(p_point, text, fontsize=font_size, color=font_color)
            
        doc.save(output_path)
        doc.close()
        return output_path
