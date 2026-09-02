import os
import shutil
import tempfile
import uuid
import zipfile
from typing import List, Tuple
from fastapi.responses import FileResponse
from starlette.background import BackgroundTasks

TEMP_DIR = os.path.join(tempfile.gettempdir(), "changefilepdf_temp")
os.makedirs(TEMP_DIR, exist_ok=True)

def create_temp_dir() -> str:
    """Create a unique temporary directory for request processing."""
    dir_path = os.path.join(TEMP_DIR, str(uuid.uuid4()))
    os.makedirs(dir_path, exist_ok=True)
    return dir_path

def cleanup_dir(dir_path: str):
    """Safely delete a directory and its contents."""
    try:
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path, ignore_errors=True)
    except Exception as e:
        print(f"Error cleaning up directory {dir_path}: {e}")

def create_cleanup_response(file_path: str, filename: str, media_type: str, cleanup_path: str = None) -> FileResponse:
    """Create a FileResponse that automatically cleans up temporary files in background."""
    tasks = BackgroundTasks()
    if cleanup_path:
        tasks.add_task(cleanup_dir, cleanup_path)
    elif os.path.exists(file_path):
        tasks.add_task(lambda: os.remove(file_path) if os.path.exists(file_path) else None)
        
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type,
        background=tasks,
        headers={"Access-Control-Expose-Headers": "Content-Disposition"}
    )

def create_zip_from_files(files: List[Tuple[str, str]], output_zip_path: str) -> str:
    """
    Create a zip file from a list of (file_path, arcname) tuples.
    """
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for fpath, arcname in files:
            if os.path.exists(fpath):
                zipf.write(fpath, arcname=arcname)
    return output_zip_path

def sanitize_filename(filename: str, default_ext: str = ".pdf") -> str:
    """Sanitize filename to prevent directory traversal and invalid characters."""
    base = os.path.basename(filename)
    clean_name = "".join(c for c in base if c.isalnum() or c in "._- ")
    if not clean_name:
        clean_name = f"document_{uuid.uuid4().hex[:8]}"
    if not os.path.splitext(clean_name)[1]:
        clean_name += default_ext
    return clean_name
