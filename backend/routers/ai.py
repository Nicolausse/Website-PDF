import os
import shutil
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.ai_service import AIService
from backend.utils.helpers import create_temp_dir, create_cleanup_response, sanitize_filename

router = APIRouter(prefix="/api/ai", tags=["AI Tools"])

@router.post("/summarize")
async def summarize_pdf(
    file: UploadFile = File(...),
    summary_type: str = Form("concise"),
    api_key: Optional[str] = Form(None)
):
    """Summarize PDF with AI (Gemini/OpenAI) or built-in extractive NLP engine."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        result = await AIService.summarize_pdf(
            input_path,
            summary_type=summary_type,
            api_key=api_key
        )
        shutil.rmtree(temp_dir, ignore_errors=True)
        return result
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal merangkum PDF: {str(e)}")

@router.post("/translate")
async def translate_pdf(
    file: UploadFile = File(...),
    target_language: str = Form("Indonesian"),
    as_pdf: bool = Form(False),
    api_key: Optional[str] = Form(None)
):
    """Translate PDF text with AI into target language (text or translated PDF)."""
    temp_dir = create_temp_dir()
    input_path = os.path.join(temp_dir, sanitize_filename(file.filename, ".pdf"))
    
    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    out_pdf_path = os.path.join(temp_dir, f"terjemahan_{sanitize_filename(file.filename, '.pdf')}") if as_pdf else None
    
    try:
        result = await AIService.translate_pdf(
            input_path,
            target_lang=target_language,
            output_pdf_path=out_pdf_path,
            api_key=api_key
        )
        
        if as_pdf and out_pdf_path and os.path.exists(out_pdf_path):
            return create_cleanup_response(
                out_pdf_path,
                filename=f"terjemahan_{target_language}_{file.filename}",
                media_type="application/pdf",
                cleanup_path=temp_dir
            )
        else:
            shutil.rmtree(temp_dir, ignore_errors=True)
            return result
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Gagal menerjemahkan PDF: {str(e)}")
