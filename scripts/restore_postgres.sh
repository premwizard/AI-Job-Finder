#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1
DB_NAME="aijobfinder"
DB_USER="postgres"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found at $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will overwrite the existing $DB_NAME database."
read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore aborted."
    exit 1
fi

echo "Dropping existing connections and restoring database..."

# Uncompress and pipe directly into the container
gunzip -c "$BACKUP_FILE" | docker exec -i postgres psql -U $DB_USER -d $DB_NAME

echo "Restore completed successfully."
