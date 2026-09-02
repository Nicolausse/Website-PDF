import os
import json
import shutil
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.manipulation_service import ManipulationService
from backend.utils.helpers import create_temp_dir, create_cleanup_response, create_zip_from_files, sanitize_filename

router = APIRouter(prefix="/api/manipulation", tags=["Manipulation"])

@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files into a single PDF document."""
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Minimal unggah 2 file PDF untuk digabungkan.")
        
    temp_dir = create_temp_dir()
    input_paths = []
    
    for i, file in enumerate(files):
        p = os.path.join(temp_dir, f"file_{i:02d}_{sanitize_filename(file.filename, '.pdf')}")
        with open(p, "wb") as f:
            shutil.copyfileobj(file.file, f)
        input_paths.append(p)
        
    output_path = os.path.join(temp_dir, "merged_document.pdf")
    try:
        ManipulationService.merge_pdfs(input_paths, output_path)
        return create_cleanup_response(
            output_path,
            filename="gabungan_dokumen.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal menggabungkan PDF: {str(e)}")

@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    page_ranges: Optional[str] = Form(None),
    split_every_page: bool = Form(False)
):
    """Split PDF by page ranges or extract each page into ZIP archive."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        out_dir = os.path.join(temp_dir, "split_output")
        os.makedirs(out_dir, exist_ok=True)
        generated_files = ManipulationService.split_pdf(
            input_path,
            out_dir,
            page_ranges=page_ranges,
            split_every_page=split_every_page
        )
        
        if len(generated_files) == 1:
            return create_cleanup_response(
                generated_files[0],
                filename=os.path.basename(generated_files[0]),
                media_type="application/pdf",
                cleanup_path=temp_dir
            )
        else:
            zip_path = os.path.join(temp_dir, "split_pdfs.zip")
            file_pairs = [(p, os.path.basename(p)) for p in generated_files]
            create_zip_from_files(file_pairs, zip_path)
            return create_cleanup_response(
                zip_path,
                filename=f"{os.path.splitext(file.filename)[0]}_pecahan.zip",
                media_type="application/zip",
                cleanup_path=temp_dir
            )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memisahkan PDF: {str(e)}")

@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("medium")
):
    """Compress PDF document size (level: low, medium, high)."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"compressed_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ManipulationService.compress_pdf(input_path, output_path, level=level)
        return create_cleanup_response(
            output_path,
            filename=f"terkompresi_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengompres PDF: {str(e)}")

@router.post("/rotate")
async def rotate_pdf(
    file: UploadFile = File(...),
    angle: int = Form(90),
    pages: str = Form("all")
):
    """Rotate PDF pages by 90, 180, or 270 degrees."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"rotated_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ManipulationService.rotate_pdf(input_path, output_path, angle=angle, pages=pages)
        return create_cleanup_response(
            output_path,
            filename=f"diputar_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memutar PDF: {str(e)}")

@router.post("/organize")
async def organize_pdf(
    file: UploadFile = File(...),
    page_order: Optional[str] = Form(None),
    pages_to_delete: Optional[str] = Form(None)
):
    """Reorder or delete pages in PDF."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"organized_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    order_list = None
    if page_order:
        try:
            order_list = [int(p.strip()) for p in page_order.split(",") if p.strip().isdigit()]
        except Exception:
            pass
            
    delete_list = None
    if pages_to_delete:
        try:
            delete_list = [int(p.strip()) for p in pages_to_delete.split(",") if p.strip().isdigit()]
        except Exception:
            pass
            
    try:
        ManipulationService.organize_pdf(input_path, output_path, page_order=order_list, pages_to_delete=delete_list)
        return create_cleanup_response(
            output_path,
            filename=f"diatur_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengatur halaman PDF: {str(e)}")

@router.post("/crop")
async def crop_pdf(
    file: UploadFile = File(...),
    left_margin: float = Form(20),
    top_margin: float = Form(20),
    right_margin: float = Form(20),
    bottom_margin: float = Form(20)
):
    """Crop PDF page margins."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"cropped_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ManipulationService.crop_pdf(
            input_path,
            output_path,
            left_margin=left_margin,
            top_margin=top_margin,
            right_margin=right_margin,
            bottom_margin=bottom_margin
        )
        return create_cleanup_response(
            output_path,
            filename=f"dipotong_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memotong PDF: {str(e)}")

@router.post("/add-page-numbers")
async def add_page_numbers(
    file: UploadFile = File(...),
    position: str = Form("bottom_center"),
    format_type: str = Form("Halaman {n} dari {total}"),
    font_size: int = Form(10),
    start_number: int = Form(1),
    color_hex: str = Form("#475569")
):
    """Add page numbers to PDF."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"numbered_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ManipulationService.add_page_numbers(
            input_path,
            output_path,
            position=position,
            format_type=format_type,
            font_size=font_size,
            start_number=start_number,
            color_hex=color_hex
        )
        return create_cleanup_response(
            output_path,
            filename=f"bernomor_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal menambahkan nomor halaman: {str(e)}")
