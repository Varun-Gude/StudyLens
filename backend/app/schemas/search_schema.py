from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .report_schema import ReportResponse

class DatasetInfo(BaseModel):
    name: str = "Standard Research Dataset"
    type: str = "Benchmark Dataset"
    purpose: str = "Used for empirical model evaluation and benchmarking."
    source: Optional[str] = "N/A"
    is_suggested: bool = False  # False = Used Dataset, True = Suggested Dataset

class FeasibilityInfo(BaseModel):
    level: str = "Suitable for Final Year Project"  # "Suitable for Final Year Project", "Requires Advanced Research Resources", "Not Recommended for Undergraduate Level"
    reason: Optional[str] = None

class PaperInfo(BaseModel):
    title: Optional[str] = None
    abstract: Optional[str] = None
    authors: Optional[List[str]] = None
    citation_count: Optional[int] = None
    year: Optional[int] = None
    url: Optional[str] = None
    research_gap: Optional[str] = None
    research_assumption: Optional[str] = None
    difficulty: Optional[str] = "MEDIUM"  # EASY, MEDIUM, HARD
    technologies: List[str] = []
    dataset_info: Optional[DatasetInfo] = None
    datasets: List[DatasetInfo] = []
    feasibility: Optional[FeasibilityInfo] = None
    suggested_research_direction: Optional[str] = None


class SearchResponse(BaseModel):
    topic: str
    report: ReportResponse
    papers: List[PaperInfo]
    seminal_papers: List[PaperInfo] = []

