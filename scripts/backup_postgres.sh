#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/var/backups/postgres"
DB_NAME="aijobfinder"
DB_USER="postgres"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="backup_${DB_NAME}_${DATE}.sql.gz"

echo "Starting database backup for $DB_NAME..."

mkdir -p $BACKUP_DIR

# Perform the backup and compress it
docker exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/$FILENAME"

echo "Backup completed successfully: $BACKUP_DIR/$FILENAME"

# Optional: Upload to S3
# aws s3 cp "$BACKUP_DIR/$FILENAME" s3://my-backup-bucket/postgres/

# Clean up old backups (older than 7 days)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete
echo "Old backups cleaned up."
