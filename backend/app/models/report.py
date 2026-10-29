from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database.database import Base

class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    executive_summary = Column(Text, nullable=False)
    overview = Column(Text, nullable=False)
    literature_review = Column(Text, nullable=False)
    technologies = Column(Text, nullable=False)
    trends = Column(Text, nullable=False)
    challenges = Column(Text, nullable=False)
    research_gaps = Column(Text, nullable=False)
    future_scope = Column(Text, nullable=False)
    project_ideas = Column(Text, nullable=False)
    publication_ideas = Column(Text, nullable=False)
    conclusion = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
