from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    searched_at = Column(DateTime(timezone=True), server_default=func.now())
