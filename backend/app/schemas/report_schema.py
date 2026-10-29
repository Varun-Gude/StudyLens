from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    topic: str
    executive_summary: str
    overview: str
    literature_review: str
    technologies: str
    trends: str
    challenges: str
    research_gaps: str
    future_scope: str
    project_ideas: str
    publication_ideas: str
    conclusion: str

class ReportResponse(BaseModel):
    id: int
    topic: str
    executive_summary: str
    overview: str
    literature_review: str
    technologies: str
    trends: str
    challenges: str
    research_gaps: str
    future_scope: str
    project_ideas: str
    publication_ideas: str
    conclusion: str
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
