#!/bin/bash
# ==============================================================================
# AUTOLINK - Script de Déploiement Automatique
# ==============================================================================
# Description: Déploie ou met à jour la plateforme Autolink
# Usage: ./deploy.sh [install|update|restart|stop|status]
# ==============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variables
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${PROJECT_DIR}/backups"
LOG_FILE="${PROJECT_DIR}/deploy.log"

# Fonction de log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERREUR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ATTENTION:${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Banner
show_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🚗  AUTOLINK - DÉPLOIEMENT AUTOMATIQUE               ║
║                                                           ║
║     Marketplace Pièces Détachées Automobiles             ║
║     Mauritanie                                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Docker
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé. Installez-le avec: curl -fsSL https://get.docker.com | sh"
    fi
    log "✅ Docker: $(docker --version)"
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose n'est pas installé. Installez-le avec: apt-get install -y docker-compose"
    fi
    log "✅ Docker Compose: $(docker-compose --version)"
    
    # Vérifier espace disque
    DISK_AVAILABLE=$(df / | tail -1 | awk '{print $4}')
    if [ $DISK_AVAILABLE -lt 10485760 ]; then
        warning "Espace disque faible: $(df -h / | tail -1 | awk '{print $4}') disponible"
    fi
    
    log "✅ Prérequis vérifiés"
}

# Installation initiale
install() {
    show_banner
    log "🚀 Installation initiale d'Autolink..."
    
    check_prerequisites
    
    cd "$PROJECT_DIR"
    
    # Créer le fichier .env s'il n'existe pas
    if [ ! -f .env ]; then
        log "Création du fichier .env depuis .env.example..."
        cp .env.example .env
        warning "⚠️ IMPORTANT: Éditez le fichier .env et configurez vos clés API!"
        warning "   - Paiements: BANKILY_*, MASRVI_*, SEDAD_*"
        warning "   - SMS: TWILIO_* ou SMS_LOCAL_*"
        warning "   - Email: SMTP_*"
        warning "   - Stockage: AWS_* ou STORAGE_*"
    fi
    
    # Créer les dossiers nécessaires
    log "Création des dossiers..."
    mkdir -p "$BACKUP_DIR"
    mkdir -p "${PROJECT_DIR}/logs"
    mkdir -p "${PROJECT_DIR}/backend/uploads"
    
    # Permissions
    chmod +x "${PROJECT_DIR}/scripts/"*.sh
    
    # Pull des images Docker
    log "Téléchargement des images Docker..."
    docker-compose pull
    
    # Build des images custom
    log "Construction des images custom..."
    docker-compose build
    
    # Démarrer les services
    log "Démarrage des services..."
    docker-compose up -d
    
    # Attendre que PostgreSQL soit prêt
    log "Attente du démarrage de PostgreSQL..."
    sleep 15
    
    # Vérifier l'état
    log "Vérification de l'état des services..."
    docker-compose ps
    
    # Afficher les informations de connexion
    echo ""
    log "✅ Installation terminée avec succès!"
    echo ""
    info "═══════════════════════════════════════════════════════"
    info "📱 ACCÈS À LA PLATEFORME"
    info "═══════════════════════════════════════════════════════"
    info ""
    info "🌐 Site Client:     http://$(hostname -I | awk '{print $1}'):3000"
    info "🔧 API Backend:     http://$(hostname -I | awk '{print $1}'):4000/api/v1"
    info "📚 Documentation:   http://$(hostname -I | awk '{print $1}'):4000/api/docs"
    info "🗄️  Admin BDD:      http://$(hostname -I | awk '{print $1}'):5050"
    info ""
    info "═══════════════════════════════════════════════════════"
    info "🔐 COMPTES PAR DÉFAUT"
    info "═══════════════════════════════════════════════════════"
    info ""
    info "Admin:    admin@autolink.mr / AutolinkAdmin2026!"
    info "Boutique: boutique1@autolink.mr / Boutique2026!"
    info "Client:   client@example.mr / Client2026!"
    info ""
    info "⚠️ CHANGEZ CES MOTS DE PASSE IMMÉDIATEMENT!"
    info ""
    warning "📝 PROCHAINES ÉTAPES:"
    warning "  1. Éditez le fichier .env avec vos vraies clés API"
    warning "  2. Redémarrez: ./deploy.sh restart"
    warning "  3. Configurez votre domaine et SSL"
    warning "  4. Lisez le GUIDE_COMPLET_DEPLOIEMENT.md"
}

# Mise à jour
update() {
    show_banner
    log "🔄 Mise à jour d'Autolink..."
    
    cd "$PROJECT_DIR"
    
    # Backup avant mise à jour
    log "Création d'un backup de sécurité..."
    if [ -x "${PROJECT_DIR}/scripts/backup-db.sh" ]; then
        "${PROJECT_DIR}/scripts/backup-db.sh"
    fi
    
    # Pull dernières images
    log "Téléchargement des dernières images..."
    docker-compose pull
    
    # Rebuild
    log "Reconstruction des images..."
    docker-compose build
    
    # Arrêter les services
    log "Arrêt des services..."
    docker-compose down
    
    # Redémarrer
    log "Redémarrage des services..."
    docker-compose up -d
    
    # Vérifier
    sleep 10
    docker-compose ps
    
    log "✅ Mise à jour terminée!"
}

# Redémarrage
restart() {
    log "🔄 Redémarrage des services..."
    cd "$PROJECT_DIR"
    docker-compose restart
    sleep 5
    docker-compose ps
    log "✅ Services redémarrés"
}

# Arrêt
stop() {
    log "⏹️  Arrêt des services..."
    cd "$PROJECT_DIR"
    docker-compose down
    log "✅ Services arrêtés"
}

# Status
status() {
    show_banner
    cd "$PROJECT_DIR"
    
    echo ""
    log "📊 État des services Docker:"
    docker-compose ps
    
    echo ""
    log "💾 Utilisation des ressources:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
    
    echo ""
    log "💿 Espace disque:"
    df -h | grep -E "Filesystem|/dev"
    
    echo ""
    log "🗄️  État PostgreSQL:"
    docker exec autolink-postgres pg_isready -U autolink_user || echo "PostgreSQL non accessible"
    
    echo ""
    log "🔴 État Redis:"
    docker exec autolink-redis redis-cli -a "AutoL1nkR3d1s@2026" ping 2>/dev/null || echo "Redis non accessible"
    
    echo ""
    log "🌐 Test API:"
    curl -s http://localhost:4000/api/v1/health | jq . 2>/dev/null || echo "API non accessible"
}

# Logs
logs() {
    cd "$PROJECT_DIR"
    
    if [ -z "$2" ]; then
        log "Affichage de tous les logs..."
        docker-compose logs -f --tail=100
    else
        log "Affichage des logs de $2..."
        docker-compose logs -f --tail=100 "$2"
    fi
}

# Menu d'aide
show_help() {
    show_banner
    echo "Usage: $0 [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  install    - Installation initiale complète"
    echo "  update     - Mise à jour de la plateforme"
    echo "  restart    - Redémarrage de tous les services"
    echo "  stop       - Arrêt de tous les services"
    echo "  status     - Afficher l'état du système"
    echo "  logs       - Afficher les logs (logs [service])"
    echo "  backup     - Créer un backup de la base"
    echo "  health     - Vérification santé du système"
    echo "  help       - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 install          # Installation initiale"
    echo "  $0 update           # Mettre à jour"
    echo "  $0 logs backend     # Voir logs backend"
    echo "  $0 status           # État du système"
}

# Backup manuel
backup() {
    log "💾 Création d'un backup manuel..."
    if [ -x "${PROJECT_DIR}/scripts/backup-db.sh" ]; then
        "${PROJECT_DIR}/scripts/backup-db.sh"
    else
        error "Script de backup non trouvé"
    fi
}

# Health check
health() {
    log "🏥 Vérification de la santé du système..."
    if [ -x "${PROJECT_DIR}/scripts/check-health.sh" ]; then
        "${PROJECT_DIR}/scripts/check-health.sh"
    else
        error "Script de health check non trouvé"
    fi
}

# Main
case "${1:-help}" in
    install)
        install
        ;;
    update)
        update
        ;;
    restart)
        restart
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    logs)
        logs "$@"
        ;;
    backup)
        backup
        ;;
    health)
        health
        ;;
    help|*)
        show_help
        ;;
esac
