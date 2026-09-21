from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    asset_id: Mapped[str] = mapped_column(
        ForeignKey("assets.id"),
        nullable=False,
        index=True,
    )

    inspector: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    condition_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    findings: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    inspection_days_ago: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )