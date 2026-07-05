"""Age / length-of-stay calculations.

Computes exact age broken down into years / months / days from a birthday to
today, and a Thai display string like "68 ปี 3 เดือน 12 วัน".
"""

from __future__ import annotations

import calendar
from datetime import date, datetime


def _to_date(value: object) -> date | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    return None


def _add_months(d: date, n: int) -> date:
    """Add n months to a date, clamping the day to the target month length."""
    m = d.month - 1 + n
    y = d.year + m // 12
    m = m % 12 + 1
    day = min(d.day, calendar.monthrange(y, m)[1])
    return date(y, m, day)


def age_parts(birthday: object, today: date | None = None) -> tuple[int, int, int] | None:
    """Return (years, months, days) of age, or None if birthday is invalid."""
    b = _to_date(birthday)
    if b is None:
        return None
    t = today or date.today()

    # Safety net: some Thai systems store the Buddhist year (พ.ศ.) in a DATE
    # column, which shows up ~543 years in the future. Normalize it.
    if b.year > t.year:
        try:
            b = b.replace(year=b.year - 543)
        except ValueError:  # e.g. Feb 29 edge case
            b = b.replace(year=b.year - 543, day=28)

    total_months = (t.year - b.year) * 12 + (t.month - b.month)
    if t.day < b.day:
        total_months -= 1
    if total_months < 0:
        return None

    years, months = divmod(total_months, 12)
    anchor = _add_months(b, total_months)
    days = (t - anchor).days
    return years, months, days


def age_display_th(birthday: object, today: date | None = None) -> str | None:
    """Return e.g. "68 ปี 3 เดือน 12 วัน", or None if birthday is invalid."""
    parts = age_parts(birthday, today)
    if parts is None:
        return None
    y, m, d = parts
    return f"{y} ปี {m} เดือน {d} วัน"


def days_between(start: object, today: date | None = None) -> int:
    """Whole days from `start` until today (>= 0). Used for length of stay."""
    s = _to_date(start)
    if s is None:
        return 0
    t = today or date.today()
    return max((t - s).days, 0)
