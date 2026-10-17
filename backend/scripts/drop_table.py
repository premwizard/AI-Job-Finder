"""
Database Migration Utility: Drop connected_accounts table.

Safely drops the legacy `connected_accounts` table from SQLite database.
"""

import sqlite3


def drop_connected_accounts_table() -> None:
    """Connect to the database and drop the connected_accounts table.

    Safely handles errors and ensures the database connection is closed.
    """
    conn = sqlite3.connect(
        "C:\\merged_partition_content\\D drive\\Crown Atlas\\backend\\sql_app.db"
    )
    cursor = conn.cursor()
    try:
        cursor.execute("DROP TABLE connected_accounts;")
        conn.commit()
        print("Table dropped.")
    except Exception as e:
        print("Error:", e)
    finally:
        conn.close()


if __name__ == "__main__":
    drop_connected_accounts_table()
