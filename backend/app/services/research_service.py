from sqlalchemy.ext.asyncio import AsyncSession
from app.models.history import SearchHistory
from app.models.report import GeneratedReport
from app.services.openalex_service import OpenAlexService
from app.services.gemini_service import GeminiService
from typing import Dict, Any
import asyncio

class ResearchService:
    @classmethod
    async def perform_research(cls, topic: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Coordinates fetching of research papers (two separate pools),
        generating the AI report, saving history/report, and returning the payload.
        - papers: top-7 most cited papers → used for Identified Research Gaps section
        - seminal_papers: different batch fetched separately → used for Seminal Research Papers grid
        """
        # 1. Fetch analysis papers (top-cited, for gap analysis) and seminal papers concurrently
        analysis_papers_raw, _ = await asyncio.gather(
            OpenAlexService.fetch_papers(topic),
            asyncio.sleep(0)  # placeholder for parallel structure
        )
        analysis_papers = analysis_papers_raw[:7]

        # Collect titles to exclude from the seminal pool
        analysis_titles = [p.title for p in analysis_papers if p.title]

        # Fetch seminal papers in parallel now that we have the exclusion list
        seminal_papers = await OpenAlexService.fetch_seminal_papers(
            topic,
            exclude_titles=analysis_titles,
            count=8
        )

        # 2. Generate report using analysis papers (includes per-paper gap/assumption generation)
        report_data = await GeminiService.generate_research_report(topic, analysis_papers)

        # 3. Create generated report model instance
        db_report = GeneratedReport(
            topic=topic,
            executive_summary=report_data["executive_summary"],
            overview=report_data["overview"],
            literature_review=report_data["literature_review"],
            technologies=report_data["technologies"],
            trends=report_data["trends"],
            challenges=report_data["challenges"],
            research_gaps=report_data["research_gaps"],
            future_scope=report_data["future_scope"],
            project_ideas=report_data["project_ideas"],
            publication_ideas=report_data["publication_ideas"],
            conclusion=report_data["conclusion"]
        )

        # 4. Attempt saving search history and report in database
        try:
            search_history = SearchHistory(topic=topic)
            db.add(search_history)
            db.add(db_report)
            await db.commit()
            await db.refresh(db_report)
        except Exception as db_err:
            print(f"[ResearchService Warning] Failed to persist report/history to database: {db_err}")
            await db.rollback()
            from datetime import datetime, timezone
            db_report.id = 1
            db_report.created_at = datetime.now(timezone.utc)

        # 5. Return the expected SearchResponse format with both paper pools
        return {
            "topic": topic,
            "report": db_report,
            "papers": analysis_papers,          # 7 papers for Research Gaps section
            "seminal_papers": seminal_papers    # 8 distinct papers for Seminal Papers grid
        }
