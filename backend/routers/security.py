import os
import json
import shutil
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.security_service import SecurityService
from backend.utils.helpers import create_temp_dir, create_cleanup_response, sanitize_filename

router = APIRouter(prefix="/api/security", tags=["Security & Forms"])

@router.post("/unlock")
async def unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form("")
):
    """Remove encryption and unlock PDF."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"unlocked_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        SecurityService.unlock_pdf(input_path, output_path, password=password)
        return create_cleanup_response(
            output_path,
            filename=f"terbuka_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except ValueError as ve:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal membuka proteksi PDF: {str(e)}")

@router.post("/protect")
async def protect_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
    owner_password: Optional[str] = Form(None),
    allow_print: bool = Form(True),
    allow_copy: bool = Form(True)
):
    """Encrypt PDF with password and access permissions."""
    if not password:
        raise HTTPException(status_code=400, detail="Password proteksi wajib diisi.")
        
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"protected_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        SecurityService.protect_pdf(
            input_path,
            output_path,
            user_password=password,
            owner_password=owner_password,
            allow_print=allow_print,
            allow_copy=allow_copy
        )
        return create_cleanup_response(
            output_path,
            filename=f"terproteksi_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memproteksi PDF: {str(e)}")

@router.post("/sign")
async def sign_pdf(
    file: UploadFile = File(...),
    signature_image: Optional[UploadFile] = File(None),
    signature_text: Optional[str] = Form(None),
    page_number: int = Form(1),
    x: float = Form(100),
    y: float = Form(650),
    width: float = Form(180),
    height: float = Form(70)
):
    """Sign PDF with uploaded signature image or formal signature stamp."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"signed_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    sig_img_path = None
    if signature_image:
        sig_img_path = os.path.join(temp_dir, f"sig_{sanitize_filename(signature_image.filename)}")
        with open(sig_img_path, "wb") as f:
            shutil.copyfileobj(signature_image.file, f)
            
    try:
        SecurityService.sign_pdf(
            input_path,
            output_path,
            signature_image_path=sig_img_path,
            signature_text=signature_text,
            page_number=page_number,
            x=x,
            y=y,
            width=width,
            height=height
        )
        return create_cleanup_response(
            output_path,
            filename=f"tertanda_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal menandatangani PDF: {str(e)}")

@router.post("/watermark")
async def watermark_pdf(
    file: UploadFile = File(...),
    watermark_text: str = Form("CONFIDENTIAL"),
    opacity: float = Form(0.25),
    angle: int = Form(45),
    font_size: int = Form(48),
    color_hex: str = Form("#64748B")
):
    """Add custom text watermark to all pages of PDF."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"watermarked_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        SecurityService.watermark_pdf(
            input_path,
            output_path,
            watermark_text=watermark_text,
            opacity=opacity,
            angle=angle,
            font_size=font_size,
            color_hex=color_hex
        )
        return create_cleanup_response(
            output_path,
            filename=f"watermark_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal menambahkan watermark: {str(e)}")

@router.post("/redact")
async def redact_pdf(
    file: UploadFile = File(...),
    search_terms: Optional[str] = Form(None),
    redact_rects: Optional[str] = Form(None)
):
    """Redact / blackout sensitive text keywords or rectangular areas."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"redacted_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    terms_list = [t.strip() for t in search_terms.split(",") if t.strip()] if search_terms else None
    rects_list = None
    if redact_rects:
        try:
            rects_list = json.loads(redact_rects)
        except Exception:
            pass
            
    try:
        SecurityService.redact_pdf(input_path, output_path, search_terms=terms_list, redact_rects=rects_list)
        return create_cleanup_response(
            output_path,
            filename=f"tersamar_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal menyamarkan data PDF: {str(e)}")

@router.post("/forms/inspect")
async def inspect_forms(file: UploadFile = File(...)):
    """Inspect AcroForm field keys in PDF."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    try:
        fields = SecurityService.get_form_fields(input_path)
        shutil.rmtree(temp_dir, ignore_errors=True)
        return {"fields": fields, "count": len(fields)}
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memeriksa form PDF: {str(e)}")

@router.post("/forms/fill")
async def fill_form(
    file: UploadFile = File(...),
    field_data: str = Form(...),
    flatten: bool = Form(False)
):
    """Fill AcroForm PDF fields with JSON payload."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"filled_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        data_dict = json.loads(field_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Data field harus berupa format JSON valid.")
        
    try:
        SecurityService.fill_form_pdf(input_path, output_path, field_data=data_dict, flatten=flatten)
        return create_cleanup_response(
            output_path,
            filename=f"terisi_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengisi form PDF: {str(e)}")
