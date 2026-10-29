# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import declarative_base
# pyrefly: ignore [missing-import]
from app.utils.config import settings

# Construct database URL with asyncpg driver if not already present
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif db_url.startswith("sqlite://") and not db_url.startswith("sqlite+aiosqlite://"):
    db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)

active_url = db_url

# Verify PostgreSQL connectivity; if credentials or connection fails, fallback to local SQLite
if active_url.startswith("postgresql"):
    try:
        import psycopg2
        sync_url = active_url.replace("postgresql+asyncpg://", "postgresql://")
        conn = psycopg2.connect(sync_url, connect_timeout=3)
        conn.close()
    except Exception as e:
        print(f"[Database Warning] PostgreSQL connection failed ({e}).")
        print("[Database Notice] Falling back to local SQLite database: studyLens.db")
        active_url = "sqlite+aiosqlite:///./studyLens.db"

# Create Async SQLAlchemy engine with dialect-specific options
if "sqlite" in active_url:
    engine = create_async_engine(
        active_url,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_async_engine(
        active_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Declarative Base for models to inherit from
Base = declarative_base()

async def init_db():
    """
    Ensure all model tables are created in the active database.
    """
    # Import models here to ensure they are registered with Base metadata
    import app.models  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

