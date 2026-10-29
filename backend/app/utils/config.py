import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Force load env variables if they aren't loaded yet
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ResearchVerse API"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:root@localhost:5432/researchverse"
    GEMINI_API_KEY: str
    OPENALEX_BASE_URL: str = "https://api.openalex.org"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
