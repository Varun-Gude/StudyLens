from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers.search import router as search_router
from app.routers.bookmark import router as bookmark_router
from app.routers.history import router as history_router
from app.database.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    try:
        await init_db()
        print("[Database] Schema verified and tables initialized.")
    except Exception as e:
        print(f"[Database Error] Table initialization error: {e}")
    yield

app = FastAPI(
    title="ResearchVerse API",
    description="Production-ready API for the AI-powered Research Topic Explorer",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware configuration allowing local frontend development origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Ensure uncaught exceptions return JSON and proper CORS headers
    """
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# Register API Routers
app.include_router(search_router)
app.include_router(bookmark_router)
app.include_router(history_router)

@app.get("/", tags=["Health"])
def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return {
        "status": "success",
        "message": "ResearchVerse API Running"
    }

