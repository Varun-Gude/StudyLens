# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, status, Response
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy.future import select
# pyrefly: ignore [missing-import]
from sqlalchemy import delete
from typing import List
from datetime import datetime
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, computed_field
from app.database.session import get_db
from app.models.history import SearchHistory

router = APIRouter(prefix="/api/history", tags=["History"])

class HistoryResponse(BaseModel):
    id: int
    topic: str
    searched_at: datetime

    @computed_field
    @property
    def query(self) -> str:
        return self.topic

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

@router.get("", response_model=List[HistoryResponse])
async def get_history(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all logged search history entries, sorted by searched date descending, limited to 50.
    """
    try:
        stmt = select(SearchHistory).order_by(SearchHistory.searched_at.desc()).limit(50)
        result = await db.execute(stmt)
        history = result.scalars().all()
        return history
    except Exception as e:
        print(f"[History API] Error retrieving history: {e}")
        return []

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_history(db: AsyncSession = Depends(get_db)):
    """
    Delete all logged search history entries.
    """
    try:
        stmt = delete(SearchHistory)
        await db.execute(stmt)
        await db.commit()
    except Exception as e:
        print(f"[History API] Error clearing history: {e}")
        await db.rollback()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

