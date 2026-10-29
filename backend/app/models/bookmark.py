from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.database import Base

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
