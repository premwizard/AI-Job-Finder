import sqlite3
import sys

conn = sqlite3.connect('C:\\merged_partition_content\\D drive\\AI Job Finder\\backend\\sql_app.db')
cursor = conn.cursor()
try:
    cursor.execute("ALTER TABLE users DROP COLUMN auth_provider;")
    conn.commit()
    print("auth_provider column dropped.")
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
