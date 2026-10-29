from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.research_service import ResearchService
from app.schemas.search_schema import SearchResponse

router = APIRouter(prefix="/api", tags=["Search"])

@router.get("/search", response_model=SearchResponse)
async def search_topic(
    topic: str = Query(..., min_length=1, description="Research topic to search and analyze"),
    db: AsyncSession = Depends(get_db)
):
    """
    Search OpenAlex, generate Gemini research report, save search history and report in database,
    and return complete insight JSON payload.
    """
    try:
        result = await ResearchService.perform_research(topic, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during search and report generation: {str(e)}"
        )
