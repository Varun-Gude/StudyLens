import httpx
from typing import List, Dict, Any
from app.utils.config import settings
from app.schemas.search_schema import PaperInfo

class OpenAlexService:
    @staticmethod
    def _reconstruct_abstract(inverted_index: Dict[str, List[int]]) -> str:
        """
        Reconstructs the abstract from OpenAlex's abstract_inverted_index representation.
        """
        if not inverted_index or not isinstance(inverted_index, dict):
            return ""
        try:
            # Find the maximum position index in the inverted index
            max_pos = 0
            for positions in inverted_index.values():
                if positions:
                    max_pos = max(max_pos, max(positions))
            
            # Reconstruct the list of words at their corresponding positions
            words = [""] * (max_pos + 1)
            for word, positions in inverted_index.items():
                for pos in positions:
                    if 0 <= pos <= max_pos:
                        words[pos] = word
            
            # Join and clean spacing
            return " ".join([w for w in words if w])
        except Exception:
            return ""

    @classmethod
    async def fetch_papers(cls, topic: str) -> List[PaperInfo]:
        """
        Fetch top 20 papers matching the topic from OpenAlex API.
        """
        url = f"{settings.OPENALEX_BASE_URL}/works"
        params = {
            "search": topic,
            "per-page": 7,
            "sort": "cited_by_count:desc"
        }
        
        # Include polite email if possible, or standard user-agent header
        headers = {
            "User-Agent": "ResearchVerse/1.0 (mailto:varun.researchverse@example.com)"
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                results = data.get("results", [])
                papers = []
                
                for work in results:
                    # Extract title
                    title = work.get("title", "Untitled Paper")
                    
                    # Extract and reconstruct abstract
                    inverted_index = work.get("abstract_inverted_index")
                    abstract = cls._reconstruct_abstract(inverted_index) or "Abstract not available."
                    
                    # Extract authors
                    authorships = work.get("authorships", [])
                    authors = []
                    for auth in authorships:
                        author_name = auth.get("author", {}).get("display_name")
                        if author_name:
                            authors.append(author_name)
                    
                    # Extract citation count
                    citation_count = work.get("cited_by_count", 0)
                    
                    # Extract publication year
                    publication_year = work.get("publication_year")
                    
                    # Extract paper URL (DOI url as primary, landing page URL as fallback)
                    paper_url = work.get("doi")
                    if not paper_url:
                        paper_url = work.get("primary_location", {}).get("landing_page_url")
                    if not paper_url and work.get("locations"):
                        # Try finding any fallback landing page URL
                        for loc in work.get("locations", []):
                            if loc.get("landing_page_url"):
                                paper_url = loc.get("landing_page_url")
                                break
                    
                    papers.append(PaperInfo(
                        title=title,
                        abstract=abstract,
                        authors=authors,
                        citation_count=citation_count,
                        year=publication_year,
                        url=paper_url or ""
                    ))
                    
                return papers
        except httpx.HTTPStatusError as e:
            # Log or handle specific status errors
            print(f"OpenAlex API returned HTTP status error: {e}")
            raise Exception(f"Failed to query OpenAlex API: Status {e.response.status_code}")
        except Exception as e:
            print(f"Error querying OpenAlex API: {e}")
            raise Exception(f"OpenAlex connection error: {str(e)}")

    @classmethod
    async def fetch_seminal_papers(cls, topic: str, exclude_titles: list = None, count: int = 8) -> List[PaperInfo]:
        """
        Fetch a separate batch of related seminal papers for display in the 
        Seminal Research Papers grid. Uses page 2 and relevance sort to ensure
        these papers do NOT overlap with the top-cited analysis papers.
        """
        url = f"{settings.OPENALEX_BASE_URL}/works"
        params = {
            "search": topic,
            "per-page": count + 4,  # Fetch extra to account for deduplication
            "sort": "relevance_score:desc",
            "page": 2  # Skip page 1 which contains the top-cited analysis papers
        }

        headers = {
            "User-Agent": "ResearchVerse/1.0 (mailto:varun.researchverse@example.com)"
        }

        exclude_set = set(t.lower().strip() for t in (exclude_titles or []))

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()

                results = data.get("results", [])
                papers = []

                for work in results:
                    title = work.get("title", "Untitled Paper")

                    # Skip any paper whose title matches the analysis set
                    if title.lower().strip() in exclude_set:
                        continue

                    inverted_index = work.get("abstract_inverted_index")
                    abstract = cls._reconstruct_abstract(inverted_index) or "Abstract not available."

                    authorships = work.get("authorships", [])
                    authors = []
                    for auth in authorships:
                        author_name = auth.get("author", {}).get("display_name")
                        if author_name:
                            authors.append(author_name)

                    citation_count = work.get("cited_by_count", 0)
                    publication_year = work.get("publication_year")

                    paper_url = work.get("doi")
                    if not paper_url:
                        paper_url = work.get("primary_location", {}).get("landing_page_url")
                    if not paper_url and work.get("locations"):
                        for loc in work.get("locations", []):
                            if loc.get("landing_page_url"):
                                paper_url = loc.get("landing_page_url")
                                break

                    papers.append(PaperInfo(
                        title=title,
                        abstract=abstract,
                        authors=authors,
                        citation_count=citation_count,
                        year=publication_year,
                        url=paper_url or ""
                    ))

                    if len(papers) >= count:
                        break

                return papers

        except Exception as e:
            print(f"Error fetching seminal papers: {e}")
            return []  # Return empty list gracefully — seminal section is non-critical
