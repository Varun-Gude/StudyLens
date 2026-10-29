# StudyLens Backend API

StudyLens is an academic research literature discovery and analysis platform designed to help students and researchers find relevant research papers, understand existing studies, compare research findings, and identify potential research gaps.

The backend retrieves academic papers from the OpenAlex API and uses Google's Gemini API to generate AI-powered research summaries, literature analysis, research gap suggestions, and future research directions.

This backend is built using **FastAPI, Python, PostgreSQL, Async SQLAlchemy 2.0, and Alembic**.

---

## 1. Setup Instructions

Follow these steps to configure and run the FastAPI server locally.

### Prerequisites

- Python 3.11 or newer
- PostgreSQL installed and running
- OpenAlex API access
- Google Gemini API key

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment.

   **Windows PowerShell:**

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   **Windows Command Prompt:**

   ```cmd
   venv\Scripts\activate.bat
   ```

   **macOS / Linux:**

   ```bash
   source venv/bin/activate
   ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

---

## 2. PostgreSQL Setup

StudyLens uses PostgreSQL to store search history, bookmarks, and generated research reports, depending on the implemented database models.

1. Start your PostgreSQL server.
2. Create a database named `studylens` using pgAdmin or `psql`:

   ```sql
   CREATE DATABASE studylens;
   ```

3. Configure the database connection in the `.env` file.
4. Apply database migrations:

   ```bash
   alembic upgrade head
   ```

**Note:** Ensure that your SQLAlchemy models and Alembic migration files are configured for the `studylens` database before running migrations.

---

## 3. Environment Variables

Create a `.env` file in the `backend/` directory using `.env.example` as a reference.

```bash
cp .env.example .env
```

On Windows, you can also create the `.env` file manually.

Configure the following variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string for async SQLAlchemy | `postgresql+asyncpg://postgres:password@localhost:5432/studylens` |
| `GEMINI_API_KEY` | Google Gemini API key | Your Gemini API key |
| `OPENALEX_BASE_URL` | OpenAlex API base URL | `https://api.openalex.org` |

Replace the example database credentials and API key with your actual values. Never commit your `.env` file or expose API keys in your repository.

---

## 4. Running FastAPI

Start the development server from the `backend/` directory:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Once the server is running, access the API documentation:

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc

The command assumes your FastAPI application is defined in `app/main.py`. If your project uses a different module path, update the command accordingly.

---

## 5. API Endpoints

All endpoints return JSON responses.

### Health Check

**Endpoint:** `GET /`

Checks whether the backend server is running.

**Example response:**

```json
{
  "status": "success",
  "message": "StudyLens API Running"
}
```

### Research Paper Search and Report Generation

**Endpoint:** `GET /api/search?topic=<search_query>`

Searches for academic papers matching the provided topic through OpenAlex and generates an AI-powered research report using Gemini.

Depending on the implementation, the endpoint can also save search history and cache generated reports in PostgreSQL.

**Example response:**

```json
{
  "topic": "machine learning in healthcare",
  "report": {
    "id": 1,
    "topic": "machine learning in healthcare",
    "executive_summary": "...",
    "overview": "...",
    "literature_review": "...",
    "technologies": "...",
    "trends": "...",
    "challenges": "...",
    "research_gaps": "...",
    "future_scope": "...",
    "project_ideas": "...",
    "publication_ideas": "...",
    "conclusion": "...",
    "created_at": "2026-07-13T19:14:19"
  },
  "papers": [
    {
      "title": "Example Research Paper",
      "abstract": "Example abstract content...",
      "authors": ["Author One", "Author Two"],
      "citation_count": 150,
      "publication_year": 2024,
      "paper_url": "https://doi.org/10.1000/xyz123"
    }
  ]
}
```

The response above is an example. The actual response fields depend on your implemented API schemas.

### Bookmarks Management

**Add a bookmark**

`POST /api/bookmarks`

Adds a research topic to the user's bookmarks.

Example request body:

```json
{
  "topic": "quantum computing"
}
```

**Retrieve bookmarks**

`GET /api/bookmarks`

Returns the saved bookmarks.

**Delete a bookmark**

`DELETE /api/bookmarks/{id}`

Deletes a bookmark using its ID.

### Search History

**Endpoint:** `GET /api/history`

Retrieves previously searched topics and their timestamps, if search history is implemented and saved in the database.

---

## 6. Main Technologies

- **FastAPI:** Creates REST API endpoints.
- **Python:** Implements backend logic and AI integration.
- **PostgreSQL:** Stores application data.
- **Async SQLAlchemy 2.0:** Provides asynchronous database operations and ORM functionality.
- **Alembic:** Manages database schema migrations.
- **OpenAlex API:** Retrieves academic research papers and publication metadata.
- **Google Gemini API:** Supports research summarization and AI-generated analysis.

---

## 7. Important Notes

- Research gap identification provides potential opportunities, not guaranteed proof of research novelty.
- Verify generated summaries and research suggestions against the original papers.
- Keep API credentials in environment variables.
- Ensure database migrations are applied before using endpoints that depend on database tables.
- Configure CORS in FastAPI to allow requests from your frontend development server, such as `http://localhost:5173`.
- The documented endpoints must match the actual routes implemented in the backend.

