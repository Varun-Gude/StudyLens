from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.session import get_db
from app.models.bookmark import Bookmark
from app.schemas.bookmark_schema import BookmarkCreate, BookmarkResponse

router = APIRouter(prefix="/api/bookmarks", tags=["Bookmarks"])

@router.post("", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def create_bookmark(payload: BookmarkCreate, db: AsyncSession = Depends(get_db)):
    """
    Save a new topic bookmark. If bookmark already exists, returns the existing record.
    """
    # Check if a bookmark for the topic already exists
    stmt = select(Bookmark).where(Bookmark.topic == payload.topic)
    result = await db.execute(stmt)
    existing = result.scalars().first()
    if existing:
        return existing

    db_bookmark = Bookmark(topic=payload.topic)
    db.add(db_bookmark)
    await db.commit()
    await db.refresh(db_bookmark)
    return db_bookmark

@router.get("", response_model=List[BookmarkResponse])
async def get_bookmarks(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all current topic bookmarks, sorted by created date descending.
    """
    try:
        stmt = select(Bookmark).order_by(Bookmark.created_at.desc())
        result = await db.execute(stmt)
        bookmarks = result.scalars().all()
        return bookmarks
    except Exception as e:
        print(f"[Bookmarks API] Error retrieving bookmarks: {e}")
        return []

@router.delete("/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(bookmark_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a bookmark by ID.
    """
    stmt = select(Bookmark).where(Bookmark.id == bookmark_id)
    result = await db.execute(stmt)
    bookmark = result.scalars().first()
    
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bookmark with ID {bookmark_id} not found"
        )
        
    await db.delete(bookmark)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
