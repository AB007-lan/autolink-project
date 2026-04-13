#!/bin/bash
# ==============================================================================
# AUTOLINK - Script de Backup Automatique PostgreSQL
# ==============================================================================
# Description: Sauvegarde quotidienne de la base de données avec rotation
# Usage: ./backup-db.sh
# Cron: 0 2 * * * /home/autolink/scripts/backup-db.sh
# ==============================================================================

set -e

# Configuration
PROJECT_DIR="/home/autolink/autolink-project"
BACKUP_DIR="${PROJECT_DIR}/backups"
POSTGRES_CONTAINER="autolink-postgres"
POSTGRES_USER="autolink_user"
POSTGRES_DB="autolink_db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="autolink_${DATE}.dump"
RETENTION_DAYS=7

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERREUR:${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ATTENTION:${NC} $1"
}

# Vérifier que Docker est lancé
if ! docker ps &> /dev/null; then
    error "Docker n'est pas accessible. Vérifiez que le service Docker est démarré."
    exit 1
fi

# Vérifier que le container PostgreSQL tourne
if ! docker ps | grep -q $POSTGRES_CONTAINER; then
    error "Le container $POSTGRES_CONTAINER n'est pas en cours d'exécution."
    exit 1
fi

# Créer le dossier de backup si nécessaire
mkdir -p "$BACKUP_DIR"

log "Démarrage du backup de la base de données..."

# Effectuer le backup dans le container
log "Création du dump PostgreSQL..."
docker exec $POSTGRES_CONTAINER pg_dump \
    -U $POSTGRES_USER \
    -d $POSTGRES_DB \
    -F c \
    -f /tmp/$BACKUP_FILE

if [ $? -ne 0 ]; then
    error "Échec de la création du dump PostgreSQL"
    exit 1
fi

# Copier le backup depuis le container vers l'hôte
log "Copie du backup vers l'hôte..."
docker cp $POSTGRES_CONTAINER:/tmp/$BACKUP_FILE $BACKUP_DIR/$BACKUP_FILE

if [ $? -ne 0 ]; then
    error "Échec de la copie du backup"
    exit 1
fi

# Nettoyer le fichier temporaire dans le container
docker exec $POSTGRES_CONTAINER rm /tmp/$BACKUP_FILE

# Vérifier la taille du backup
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
log "Backup créé: $BACKUP_FILE (Taille: $BACKUP_SIZE)"

# Compression du backup (optionnel)
log "Compression du backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Vérifier que la compression a réussi
if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    COMPRESSED_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    log "Backup compressé: $BACKUP_FILE (Taille: $COMPRESSED_SIZE)"
else
    error "Échec de la compression"
    exit 1
fi

# Rotation des backups (garder seulement les N derniers jours)
log "Nettoyage des anciens backups (conservation: $RETENTION_DAYS jours)..."
find "$BACKUP_DIR" -name "autolink_*.dump.gz" -type f -mtime +$RETENTION_DAYS -delete

BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/autolink_*.dump.gz 2>/dev/null | wc -l)
log "Nombre de backups conservés: $BACKUP_COUNT"

# Vérification d'intégrité du backup (optionnel)
log "Vérification de l'intégrité du backup..."
if gunzip -t "$BACKUP_DIR/$BACKUP_FILE" 2>/dev/null; then
    log "✅ Le backup est valide et intègre"
else
    error "⚠️ Le backup pourrait être corrompu"
    exit 1
fi

# Statistiques
log "=== Statistiques des backups ==="
log "Dossier: $BACKUP_DIR"
log "Total backups: $BACKUP_COUNT"
log "Dernier backup: $BACKUP_FILE ($COMPRESSED_SIZE)"
log "Espace disque utilisé:"
du -sh "$BACKUP_DIR"

log "✅ Backup terminé avec succès!"

# Optionnel: Envoyer une notification
# Décommenter et configurer si vous voulez recevoir un email
# echo "Backup Autolink réussi: $BACKUP_FILE" | mail -s "Autolink Backup Success" admin@autolink.mr

exit 0
