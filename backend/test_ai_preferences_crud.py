"""
Automated Test — Phase 2 Module 13: AI Preferences
Tests: GET (empty), PUT (create all 9 fields), GET (verify), PUT (partial update), field persistence.
"""
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User, AIPreference
from app.schemas.profile_schemas import AIPreferenceUpdate
from app.services.profile_service import ProfileService


def test_ai_preferences_crud():
    print("--- Starting AI Preferences CRUD Test ---")

    Base.metadata.create_all(bind=engine)

    # Apply safe migrations for new columns
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE ai_preferences ADD COLUMN preferred_learning_resources VARCHAR",
            "ALTER TABLE ai_preferences ADD COLUMN target_countries VARCHAR",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_ai_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="AI", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. GET empty preferences ───────────────────────────────────────
        empty = service.get_ai_preferences(user_id)
        assert empty is not None
        assert empty.dream_companies is None
        assert empty.preferred_learning_resources is None
        print(f"[SUCCESS] GET empty — returned default empty response")

        # ── 2. PUT — create all 9 required fields ─────────────────────────
        data = AIPreferenceUpdate(
            dream_companies="OpenAI,Google,Anthropic",
            dream_roles="AI Researcher,Staff Engineer",
            dream_technologies="LLMs,PyTorch,Rust",
            preferred_ai_domains="Natural Language Processing,Generative AI",
            learning_goals="Master RLHF and RAG architectures. Complete Fast.ai deep learning course.",
            preferred_learning_resources="Fast.ai,ArXiv Papers,Deeplearning.ai",
            target_salary="$200,000",
            target_countries="United States,United Kingdom,Remote / Worldwide",
            career_objectives="Lead AI research at a frontier AI lab, publishing impactful papers.",
            career_growth_priorities="Technical Leadership,Research Publications,Open Source Contributions",
        )
        created = service.update_ai_preferences(user_id, data)
        assert created.dream_companies == "OpenAI,Google,Anthropic"
        assert created.dream_roles == "AI Researcher,Staff Engineer"
        assert created.dream_technologies == "LLMs,PyTorch,Rust"
        assert created.preferred_ai_domains == "Natural Language Processing,Generative AI"
        assert "RLHF" in created.learning_goals
        assert created.preferred_learning_resources == "Fast.ai,ArXiv Papers,Deeplearning.ai"
        assert created.target_salary == "$200,000"
        assert created.target_countries == "United States,United Kingdom,Remote / Worldwide"
        assert "frontier AI lab" in created.career_objectives
        assert created.career_growth_priorities == "Technical Leadership,Research Publications,Open Source Contributions"
        print(f"[SUCCESS] PUT create — all 9 fields set correctly")

        # ── 3. GET — verify persistence ────────────────────────────────────
        fetched = service.get_ai_preferences(user_id)
        assert fetched.dream_companies == "OpenAI,Google,Anthropic"
        assert fetched.preferred_learning_resources == "Fast.ai,ArXiv Papers,Deeplearning.ai"
        assert fetched.target_countries == "United States,United Kingdom,Remote / Worldwide"
        print(f"[SUCCESS] GET after create — dream_companies: {fetched.dream_companies[:30]}…")

        # ── 4. PUT — partial update ────────────────────────────────────────
        partial = AIPreferenceUpdate(
            dream_companies="OpenAI,Meta,Stripe",
            target_salary="$250,000",
        )
        updated = service.update_ai_preferences(user_id, partial)
        assert updated.dream_companies == "OpenAI,Meta,Stripe"
        assert updated.target_salary == "$250,000"
        # Unchanged fields must be preserved
        assert updated.dream_roles == "AI Researcher,Staff Engineer"
        assert updated.preferred_learning_resources == "Fast.ai,ArXiv Papers,Deeplearning.ai"
        print(f"[SUCCESS] PUT partial update — dream_companies updated, dream_roles preserved")

        # ── 5. Verify updated_at is populated ─────────────────────────────
        final = service.get_ai_preferences(user_id)
        assert final.updated_at is not None
        print(f"[SUCCESS] updated_at is set: {final.updated_at}")

        # Cleanup
        ai_record = db.query(AIPreference).filter(AIPreference.user_id == user_id).first()
        if ai_record:
            db.delete(ai_record)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL AI PREFERENCES CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_ai_preferences_crud()
