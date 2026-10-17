"""
Database Migration Utility: Drop auth_provider column.

Safely drops the legacy `auth_provider` column from the `users` table in SQLite.
"""

import sqlite3


def drop_auth_provider_column() -> None:
    """Connect to the database and drop the auth_provider column from the users table.

    Safely handles errors and closes the database connection upon completion.
    """
    conn = sqlite3.connect(
        "C:\\merged_partition_content\\D drive\\Crown Atlas\\backend\\sql_app.db"
    )
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE users DROP COLUMN auth_provider;")
        conn.commit()
        print("auth_provider column dropped.")
    except Exception as e:
        print("Error:", e)
    finally:
        conn.close()


if __name__ == "__main__":
    drop_auth_provider_column()
