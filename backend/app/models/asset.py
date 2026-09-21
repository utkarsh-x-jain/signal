from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    risk: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Low",
    )

    updated: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )