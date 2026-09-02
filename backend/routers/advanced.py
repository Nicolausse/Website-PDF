import os
import json
import shutil
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.advanced_service import AdvancedService
from backend.utils.helpers import create_temp_dir, create_cleanup_response, sanitize_filename

router = APIRouter(prefix="/api/advanced", tags=["Advanced Tools"])

@router.post("/edit")
async def edit_pdf(
    file: UploadFile = File(...),
    edits_json: str = Form(...),
    stamp_image: Optional[UploadFile] = File(None)
):
    """Apply visual edits (text, boxes, highlights, images) to PDF."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"edited_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        edits_list = json.loads(edits_json)
    except Exception:
        raise HTTPException(status_code=400, detail="Format edits_json tidak valid.")
        
    if stamp_image:
        stamp_path = os.path.join(temp_dir, f"stamp_{sanitize_filename(stamp_image.filename)}")
        with open(stamp_path, "wb") as f:
            shutil.copyfileobj(stamp_image.file, f)
        for edit in edits_list:
            if edit.get("type") == "image" and not edit.get("imagePath"):
                edit["imagePath"] = stamp_path
                
    try:
        AdvancedService.edit_pdf(input_path, output_path, edits_list)
        return create_cleanup_response(
            output_path,
            filename=f"diedit_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengedit PDF: {str(e)}")

@router.post("/ocr")
async def ocr_pdf(
    file: UploadFile = File(...),
    lang: str = Form("eng+ind"),
    make_searchable: bool = Form(True)
):
    """Perform OCR on scanned PDF and return searchable PDF or extracted text data."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"ocr_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ocr_result = AdvancedService.ocr_pdf(input_path, output_path, lang=lang, make_searchable=make_searchable)
        
        if make_searchable and os.path.exists(output_path):
            return create_cleanup_response(
                output_path,
                filename=f"ocr_{file.filename}",
                media_type="application/pdf",
                cleanup_path=temp_dir
            )
        else:
            shutil.rmtree(temp_dir, ignore_errors=True)
            return ocr_result
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal melakukan OCR PDF: {str(e)}")

@router.post("/repair")
async def repair_pdf(file: UploadFile = File(...)):
    """Repair damaged or corrupt PDF document."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"repaired_{sanitize_filename(file.filename, '.pdf')}")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        stats = AdvancedService.repair_pdf(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"diperbaiki_{file.filename}",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memperbaiki file PDF: {str(e)}")

@router.post("/compare")
async def compare_pdfs(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    """Compare two PDF documents and analyze text differences."""
    temp_dir = create_temp_dir()
    p1 = os.path.join(temp_dir, f"doc1_{sanitize_filename(file1.filename, '.pdf')}")
    p2 = os.path.join(temp_dir, f"doc2_{sanitize_filename(file2.filename, '.pdf')}")
    
    with open(p1, "wb") as f:
        shutil.copyfileobj(file1.file, f)
    with open(p2, "wb") as f:
        shutil.copyfileobj(file2.file, f)
        
    try:
        diff_data = AdvancedService.compare_pdfs(p1, p2)
        shutil.rmtree(temp_dir, ignore_errors=True)
        return diff_data
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal membandingkan PDF: {str(e)}")
