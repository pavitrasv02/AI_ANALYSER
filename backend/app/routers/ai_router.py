from functools import lru_cache

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.ai_models import ComplaintStructuredData, ComplaintTextRequest
from app.services.document_parser import DocumentExtractionError, extract_text_from_upload
from app.workflows.complaint_graph import ComplaintLangGraphWorkflow

router = APIRouter(prefix="/api/ai", tags=["AI Copilot"])


@lru_cache(maxsize=1)
def get_workflow() -> ComplaintLangGraphWorkflow:
    return ComplaintLangGraphWorkflow()


@router.post(
    "/analyze-complaint",
    response_model=ComplaintStructuredData,
    summary="Analyze complaint text with LangGraph + Groq",
)
def analyze_complaint(payload: ComplaintTextRequest) -> ComplaintStructuredData:
    try:
        workflow = get_workflow()
        result = workflow.run(payload.complaint_text)
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI complaint analysis failed: {str(exc)}",
        ) from exc


@router.post(
    "/analyze-document",
    response_model=ComplaintStructuredData,
    summary="Extract text from PDF/DOCX/TXT and analyze with existing LangGraph workflow",
)
async def analyze_document(
    file: UploadFile = File(...),
) -> ComplaintStructuredData:
    try:
        extracted_text = await extract_text_from_upload(file)
        workflow = get_workflow()
        return workflow.run(extracted_text)
    except DocumentExtractionError as exc:
        raise HTTPException(status_code=400, detail=exc.message) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI document analysis failed: {str(exc)}",
        ) from exc
