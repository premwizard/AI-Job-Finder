import sqlite3

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
