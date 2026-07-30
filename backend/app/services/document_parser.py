from __future__ import annotations

from io import BytesIO
from pathlib import Path

from fastapi import UploadFile


class DocumentExtractionError(Exception):
    """Raised when document parsing fails with a user-facing message."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def detect_extension(filename: str | None) -> str:
    if not filename:
        raise DocumentExtractionError("Unsupported file format.")

    extension = Path(filename).suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        raise DocumentExtractionError("Unsupported file format.")
    return extension


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise DocumentExtractionError("Unable to extract text.") from exc

    try:
        reader = PdfReader(BytesIO(file_bytes))
        pages = []
        for page in reader.pages:
            pages.append(page.extract_text() or "")
        return "\n".join(pages).strip()
    except Exception as exc:
        raise DocumentExtractionError("Unable to extract text.") from exc


def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        from docx import Document
    except ImportError as exc:
        raise DocumentExtractionError("Unable to extract text.") from exc

    try:
        document = Document(BytesIO(file_bytes))
        paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text]
        return "\n".join(paragraphs).strip()
    except Exception as exc:
        raise DocumentExtractionError("Unable to extract text.") from exc


def extract_text_from_txt(file_bytes: bytes) -> str:
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            return file_bytes.decode(encoding).strip()
        except UnicodeDecodeError:
            continue
    raise DocumentExtractionError("Unable to extract text.")


async def extract_text_from_upload(upload: UploadFile) -> str:
    extension = detect_extension(upload.filename)
    file_bytes = await upload.read()

    if not file_bytes:
        raise DocumentExtractionError("No complaint information detected.")

    if extension == ".pdf":
        text = extract_text_from_pdf(file_bytes)
    elif extension == ".docx":
        text = extract_text_from_docx(file_bytes)
    else:
        text = extract_text_from_txt(file_bytes)

    if not text:
        raise DocumentExtractionError("No complaint information detected.")

    return text
