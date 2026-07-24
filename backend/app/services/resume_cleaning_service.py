"""
Resume Cleaning Engine — Phase 3 Module 4
Cleans raw extracted resume text by removing headers/footers, page numbers, duplicates,
extra spaces, and broken sentences, and normalizing dates, bullet points, emails, phone numbers, and URLs.
"""

import re
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.models import Resume
from app.schemas import profile_schemas


class ResumeCleaner:
    """Core text cleaning & normalization engine for raw resume text."""

    @classmethod
    def remove_page_numbers_headers_footers(cls, text: str) -> str:
        """Remove page numbers, headers, and footers."""
        if not text:
            return ""

        lines = text.split("\n")
        cleaned_lines = []

        # Header/Footer regex patterns
        page_pattern = re.compile(
            r"^\s*(page\s*\d+(\s*of\s*\d+)?|\d+\s*/\s*\d+|\[?\s*page\s*\d+\s*\]?|\d+)\s*$",
            re.IGNORECASE,
        )
        confidential_pattern = re.compile(
            r"^\s*(confidential|all\s+rights\s+reserved|curriculum\s+vitae|resume)\s*$",
            re.IGNORECASE,
        )

        for line in lines:
            line_str = line.strip()
            # Skip page number lines
            if page_pattern.match(line_str):
                continue
            # Skip standalone generic footer lines
            if confidential_pattern.match(line_str):
                continue
            cleaned_lines.append(line)

        return "\n".join(cleaned_lines)

    @classmethod
    def remove_duplicate_lines(cls, text: str) -> str:
        """Remove consecutive duplicate lines."""
        if not text:
            return ""

        lines = text.split("\n")
        unique_lines = []
        prev_line = None

        for line in lines:
            stripped = line.strip()
            if stripped and stripped == prev_line:
                continue
            unique_lines.append(line)
            if stripped:
                prev_line = stripped

        return "\n".join(unique_lines)

    @classmethod
    def fix_broken_sentences(cls, text: str) -> str:
        """Fix hyphenated word wrapping and broken sentence line breaks."""
        if not text:
            return ""

        # 1. Join hyphenated words across line breaks e.g. "soft-\nware" -> "software"
        text = re.sub(r"(\b[a-zA-Z]{2,})-\s*\n\s*([a-zA-Z]{2,}\b)", r"\1\2", text)

        # 2. Join lines where line N ends without terminal punctuation and line N+1 starts with lowercase
        lines = text.split("\n")
        fixed_lines = []
        i = 0
        while i < len(lines):
            curr = lines[i].rstrip()
            if (
                i + 1 < len(lines)
                and curr
                and not curr.endswith((".", ":", ";", "!", "?", "•", "-"))
                and not curr.isupper()
            ):
                next_line = lines[i + 1].lstrip()
                # Check if next line starts with a lowercase letter
                if next_line and next_line[0].islower():
                    curr = f"{curr} {next_line}"
                    i += 1  # Skip next line as it was merged
            fixed_lines.append(curr)
            i += 1

        return "\n".join(fixed_lines)

    @classmethod
    def normalize_bullet_points(cls, text: str) -> str:
        """Standardize all bullet point symbols to a clean '• ' format."""
        if not text:
            return ""

        lines = text.split("\n")
        normalized = []

        bullet_regex = re.compile(
            r"^\s*([\u2022\u2023\u25e6\u2043\u2219\-\*\▪\▸\>])\s+"
        )

        for line in lines:
            if bullet_regex.match(line):
                cleaned_line = bullet_regex.sub("• ", line)
                normalized.append(cleaned_line)
            else:
                normalized.append(line)

        return "\n".join(normalized)

    @classmethod
    def normalize_dates(cls, text: str) -> str:
        """Normalize date ranges and date strings into readable formats (e.g. Jan 2021 – Present)."""
        if not text:
            return ""

        # Normalize "Present" variants
        text = re.compile(r"\b(current|till date|to date)\b", re.IGNORECASE).sub("Present", text)

        # Normalize Month Year e.g. 01/2021 or 01-2021 -> Jan 2021
        months = {
            "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
            "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
            "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
        }
        def replace_num_date(match):
            m, y = match.group(1), match.group(2)
            month_name = months.get(m, m)
            return f"{month_name} {y}"

        text = re.sub(r"\b(0[1-9]|1[0-2])[-/](20\d{2}|19\d{2})\b", replace_num_date, text)
        return text

    @classmethod
    def normalize_emails(cls, text: str) -> str:
        """Normalize email addresses (lowercase, clean obfuscated formats)."""
        if not text:
            return ""

        # Clean obfuscated emails e.g. "john [at] gmail [dot] com"
        text = re.sub(
            r"\b([a-zA-Z0-9._%+-]+)\s*\[?\s*at\s*\]?\s*([a-zA-Z0-9.-]+)\s*\[?\s*dot\s*\]?\s*([a-zA-Z]{2,})\b",
            r"\1@\2.\3",
            text,
            flags=re.IGNORECASE,
        )

        # Standardize email addresses to lowercase
        def lower_email(match):
            return match.group(0).lower()

        text = re.sub(r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b", lower_email, text)
        return text

    @classmethod
    def normalize_phone_numbers(cls, text: str) -> str:
        """Normalize phone numbers to clean international/standard format e.g. +1 (123) 456-7890."""
        if not text:
            return ""

        # Normalize 10-digit US/International phone numbers e.g. 123.456.7890 or 123-456-7890
        def format_phone(match):
            area, prefix, line = match.group(1), match.group(2), match.group(3)
            return f"({area}) {prefix}-{line}"

        text = re.sub(r"\b\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})\b", format_phone, text)
        return text

    @classmethod
    def normalize_urls(cls, text: str) -> str:
        """Normalize URLs and social profile links."""
        if not text:
            return ""

        # Remove redundant protocol prefix from display URLs e.g. https://www.linkedin.com -> linkedin.com
        text = re.sub(r"https?://(www\.)?", "", text, flags=re.IGNORECASE)
        return text

    @classmethod
    def clean_whitespace(cls, text: str) -> str:
        """Clean extra spaces, tabs, and excess blank lines."""
        if not text:
            return ""

        # Normalize multiple spaces to single space
        text = re.sub(r"[ \t]+", " ", text)
        # Remove trailing spaces on lines
        lines = [line.strip() for line in text.split("\n")]
        # Max 2 consecutive empty lines
        cleaned = re.sub(r"\n{3,}", "\n\n", "\n".join(lines))
        return cleaned.strip()

    @classmethod
    def clean_raw_text(cls, raw_text: str) -> str:
        """Execute full resume cleaning pipeline."""
        if not raw_text:
            return ""

        text = cls.remove_page_numbers_headers_footers(raw_text)
        text = cls.remove_duplicate_lines(text)
        text = cls.fix_broken_sentences(text)
        text = cls.normalize_bullet_points(text)
        text = cls.normalize_dates(text)
        text = cls.normalize_emails(text)
        text = cls.normalize_phone_numbers(text)
        text = cls.normalize_urls(text)
        text = cls.clean_whitespace(text)

        return text


class ResumeCleaningService:
    """Backend service for cleaning raw resume text and saving cleaned output in database."""

    def __init__(self, db: Session):
        self.db = db

    def clean_user_resume(self, user_id: str, resume_id: int) -> profile_schemas.ResumeResponse:
        """Clean raw resume text for a specific user resume record."""
        resume = (
            self.db.query(Resume)
            .filter(Resume.id == resume_id, Resume.user_id == user_id)
            .first()
        )
        if not resume:
            raise Exception("Resume not found")

        # Perform cleaning
        raw_text = resume.raw_text or ""
        clean_text = ResumeCleaner.clean_raw_text(raw_text)

        resume.clean_text = clean_text
        resume.cleaned_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(resume)

        return profile_schemas.ResumeResponse.model_validate(resume)
