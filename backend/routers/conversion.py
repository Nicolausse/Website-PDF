import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.conversion_service import ConversionService
from backend.utils.helpers import create_temp_dir, create_cleanup_response, create_zip_from_files, sanitize_filename

router = APIRouter(prefix="/api/conversion", tags=["Conversion"])

@router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    """Convert DOCX or DOC file to PDF using LibreOffice headless."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".docx", ".doc"]:
        raise HTTPException(status_code=400, detail="Format file harus .docx atau .doc")
        
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ext))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.pdf")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.word_to_pdf(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi Word ke PDF: {str(e)}")

@router.post("/ppt-to-pdf")
async def ppt_to_pdf(file: UploadFile = File(...)):
    """Convert PPTX or PPT file to PDF using LibreOffice headless."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pptx", ".ppt"]:
        raise HTTPException(status_code=400, detail="Format file harus .pptx atau .ppt")
        
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ext))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.pdf")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.ppt_to_pdf(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PPT ke PDF: {str(e)}")

@router.post("/excel-to-pdf")
async def excel_to_pdf(file: UploadFile = File(...)):
    """Convert XLSX, XLS, or CSV to PDF."""
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Format file harus .xlsx, .xls, atau .csv")
        
    temp_dir = create_temp_dir()
    ext = os.path.splitext(file.filename)[1]
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ext))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.pdf")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.excel_to_pdf(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi Excel ke PDF: {str(e)}")

@router.post("/jpg-to-pdf")
async def jpg_to_pdf(
    files: List[UploadFile] = File(...),
    orientation: str = Form("portrait"),
    margin: int = Form(20)
):
    """Convert images (JPG, PNG, WEBP) to PDF."""
    temp_dir = create_temp_dir()
    img_paths = []
    
    for i, file in enumerate(files):
        img_path = os.path.join(temp_dir, f"img_{i}_{sanitize_filename(file.filename)}")
        with open(img_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        img_paths.append(img_path)
        
    output_path = os.path.join(temp_dir, "converted_images.pdf")
    try:
        ConversionService.jpg_to_pdf(img_paths, output_path, orientation=orientation, margin=margin)
        return create_cleanup_response(
            output_path,
            filename="images_converted.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi Gambar ke PDF: {str(e)}")

@router.post("/html-to-pdf")
async def html_to_pdf(
    file: Optional[UploadFile] = File(None),
    html_content: Optional[str] = Form(None)
):
    """Convert HTML file or raw HTML string to PDF."""
    temp_dir = create_temp_dir()
    content = ""
    if file:
        content_bytes = await file.read()
        content = content_bytes.decode("utf-8", errors="ignore")
    elif html_content:
        content = html_content
    else:
        raise HTTPException(status_code=400, detail="Harap unggah file HTML atau masukkan teks HTML.")
        
    output_path = os.path.join(temp_dir, "document.pdf")
    try:
        ConversionService.html_to_pdf(content, output_path)
        return create_cleanup_response(
            output_path,
            filename="html_converted.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi HTML ke PDF: {str(e)}")

@router.post("/scan-to-pdf")
async def scan_to_pdf(
    files: List[UploadFile] = File(...),
    enhance: bool = Form(True),
    grayscale: bool = Form(False)
):
    """Process scanned document images and combine into clean PDF."""
    temp_dir = create_temp_dir()
    img_paths = []
    for i, file in enumerate(files):
        p = os.path.join(temp_dir, f"scan_{i}_{sanitize_filename(file.filename)}")
        with open(p, "wb") as f:
            shutil.copyfileobj(file.file, f)
        img_paths.append(p)
        
    output_path = os.path.join(temp_dir, "scanned_doc.pdf")
    try:
        ConversionService.scan_to_pdf(img_paths, output_path, enhance=enhance, grayscale=grayscale)
        return create_cleanup_response(
            output_path,
            filename="scanned_document.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal memproses Pindai ke PDF: {str(e)}")

@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    """Convert PDF to Word DOCX."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.docx")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.pdf_to_word(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PDF ke Word: {str(e)}")

@router.post("/pdf-to-ppt")
async def pdf_to_ppt(file: UploadFile = File(...)):
    """Convert PDF to PowerPoint PPTX."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.pptx")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.pdf_to_ppt(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.pptx",
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PDF ke PPT: {str(e)}")

@router.post("/pdf-to-excel")
async def pdf_to_excel(file: UploadFile = File(...)):
    """Convert PDF tables to Excel XLSX."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.xlsx")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.pdf_to_excel(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PDF ke Excel: {str(e)}")

@router.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...), dpi: int = Form(150)):
    """Convert PDF pages to JPG images in a ZIP bundle."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        images_dir = os.path.join(temp_dir, "images")
        os.makedirs(images_dir, exist_ok=True)
        img_paths = ConversionService.pdf_to_jpg(input_path, images_dir, dpi=dpi)
        
        zip_path = os.path.join(temp_dir, "pdf_images.zip")
        file_pairs = [(p, os.path.basename(p)) for p in img_paths]
        create_zip_from_files(file_pairs, zip_path)
        
        return create_cleanup_response(
            zip_path,
            filename=f"{os.path.splitext(file.filename)[0]}_images.zip",
            media_type="application/zip",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PDF ke JPG: {str(e)}")

@router.post("/pdf-to-pdfa")
async def pdf_to_pdfa(file: UploadFile = File(...)):
    """Convert PDF to archival PDF/A standard."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}_pdfa.pdf")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.pdf_to_pdfa(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}_pdfa.pdf",
            media_type="application/pdf",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PDF ke PDF/A: {str(e)}")

@router.post("/pdf-to-markdown")
async def pdf_to_markdown(file: UploadFile = File(...)):
    """Extract PDF structure to Markdown (.md)."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    output_path = os.path.join(temp_dir, f"{os.path.splitext(file.filename)[0]}.md")
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        ConversionService.pdf_to_markdown(input_path, output_path)
        return create_cleanup_response(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.md",
            media_type="text/markdown",
            cleanup_path=temp_dir
        )
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal mengonversi PDF ke Markdown: {str(e)}")
