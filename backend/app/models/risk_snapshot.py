from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class RiskSnapshot(Base):
    __tablename__ = "risk_snapshots"

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

    rule_risk: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    ml_risk: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    captured_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )