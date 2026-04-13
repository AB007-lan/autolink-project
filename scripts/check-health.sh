#!/bin/bash
# ==============================================================================
# AUTOLINK - Script de Health Check
# ==============================================================================
# Description: Vérifie l'état de santé de tous les services
# Usage: ./check-health.sh
# ==============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_DIR="/home/autolink/autolink-project"
API_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         AUTOLINK - HEALTH CHECK SYSTÈME                  ║"
echo "║         $(date +'%Y-%m-%d %H:%M:%S')                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ==============================================================================
# 1. DOCKER CONTAINERS
# ==============================================================================
echo -e "${YELLOW}[1] DOCKER CONTAINERS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v docker &> /dev/null; then
    docker-compose ps
    
    # Compter les containers actifs
    RUNNING=$(docker ps -q | wc -l)
    TOTAL=$(docker-compose ps -q | wc -l)
    
    if [ $RUNNING -eq $TOTAL ]; then
        echo -e "${GREEN}✅ Tous les containers sont actifs ($RUNNING/$TOTAL)${NC}"
    else
        echo -e "${RED}⚠️ Certains containers sont arrêtés ($RUNNING/$TOTAL actifs)${NC}"
    fi
else
    echo -e "${RED}❌ Docker n'est pas installé ou non accessible${NC}"
fi

echo ""

# ==============================================================================
# 2. RESSOURCES SYSTÈME
# ==============================================================================
echo -e "${YELLOW}[2] RESSOURCES SYSTÈME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# CPU
echo "CPU:"
top -bn1 | grep "Cpu(s)" | awk '{print "  Utilisation: " $2 " user, " $4 " system, " $8 " idle"}'

# Mémoire
echo ""
echo "Mémoire RAM:"
free -h | awk '/^Mem:/ {printf "  Total: %s | Utilisée: %s | Libre: %s | Pourcentage: %.1f%%\n", $2, $3, $4, ($3/$2)*100}'

# Disque
echo ""
echo "Espace Disque:"
df -h | grep -E "Filesystem|/dev" | awk 'NR==1 {print "  "$0} NR>1 {printf "  %-20s %6s %6s %6s %4s %s\n", $1, $2, $3, $4, $5, $6}'

# Vérifier l'espace disque critique
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo -e "${RED}⚠️ ALERTE: Espace disque critique ($DISK_USAGE%)${NC}"
elif [ $DISK_USAGE -gt 80 ]; then
    echo -e "${YELLOW}⚠️ Attention: Espace disque élevé ($DISK_USAGE%)${NC}"
else
    echo -e "${GREEN}✅ Espace disque OK ($DISK_USAGE%)${NC}"
fi

echo ""

# ==============================================================================
# 3. BASE DE DONNÉES POSTGRESQL
# ==============================================================================
echo -e "${YELLOW}[3] BASE DE DONNÉES POSTGRESQL${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q autolink-postgres; then
    # Test de connexion
    if docker exec autolink-postgres pg_isready -U autolink_user &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL est accessible${NC}"
        
        # Statistiques de la base
        echo ""
        echo "Statistiques:"
        docker exec autolink-postgres psql -U autolink_user -d autolink_db -t -c "
            SELECT 
                'Utilisateurs: ' || COUNT(*) FROM users
            UNION ALL
            SELECT 'Boutiques: ' || COUNT(*) FROM boutiques
            UNION ALL
            SELECT 'Produits: ' || COUNT(*) FROM products
            UNION ALL
            SELECT 'Commandes: ' || COUNT(*) FROM orders;
        " | sed 's/^/  /'
        
        # Taille de la base
        echo ""
        DB_SIZE=$(docker exec autolink-postgres psql -U autolink_user -d autolink_db -t -c "SELECT pg_size_pretty(pg_database_size('autolink_db'));" | xargs)
        echo "  Taille de la base: $DB_SIZE"
        
    else
        echo -e "${RED}❌ PostgreSQL n'est pas accessible${NC}"
    fi
else
    echo -e "${RED}❌ Container PostgreSQL n'est pas en cours d'exécution${NC}"
fi

echo ""

# ==============================================================================
# 4. REDIS
# ==============================================================================
echo -e "${YELLOW}[4] REDIS CACHE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q autolink-redis; then
    if docker exec autolink-redis redis-cli -a "AutoL1nkR3d1s@2026" ping 2>/dev/null | grep -q PONG; then
        echo -e "${GREEN}✅ Redis est accessible${NC}"
        
        # Statistiques Redis
        KEYS_COUNT=$(docker exec autolink-redis redis-cli -a "AutoL1nkR3d1s@2026" DBSIZE 2>/dev/null | awk '{print $2}')
        echo "  Nombre de clés: $KEYS_COUNT"
        
        MEMORY=$(docker exec autolink-redis redis-cli -a "AutoL1nkR3d1s@2026" INFO memory 2>/dev/null | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
        echo "  Mémoire utilisée: $MEMORY"
    else
        echo -e "${RED}❌ Redis n'est pas accessible${NC}"
    fi
else
    echo -e "${RED}❌ Container Redis n'est pas en cours d'exécution${NC}"
fi

echo ""

# ==============================================================================
# 5. BACKEND API
# ==============================================================================
echo -e "${YELLOW}[5] BACKEND API${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q autolink-backend; then
    # Test HTTP
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/v1/health 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ API Backend accessible (HTTP $HTTP_CODE)${NC}"
        echo "  URL: $API_URL/api/v1"
        echo "  Docs: $API_URL/api/docs"
    else
        echo -e "${RED}❌ API Backend non accessible (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "${RED}❌ Container Backend n'est pas en cours d'exécution${NC}"
fi

echo ""

# ==============================================================================
# 6. FRONTEND WEB
# ==============================================================================
echo -e "${YELLOW}[6] FRONTEND WEB${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q autolink-frontend; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Frontend accessible (HTTP $HTTP_CODE)${NC}"
        echo "  URL: $FRONTEND_URL"
    else
        echo -e "${RED}❌ Frontend non accessible (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "${RED}❌ Container Frontend n'est pas en cours d'exécution${NC}"
fi

echo ""

# ==============================================================================
# 7. NGINX REVERSE PROXY
# ==============================================================================
echo -e "${YELLOW}[7] NGINX REVERSE PROXY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps | grep -q autolink-nginx; then
    echo -e "${GREEN}✅ Nginx est en cours d'exécution${NC}"
    
    # Vérifier les certificats SSL (si configurés)
    if [ -d "/etc/letsencrypt/live" ]; then
        CERT_EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/*/fullchain.pem 2>/dev/null | cut -d= -f2 || echo "Non configuré")
        echo "  Certificat SSL: $CERT_EXPIRY"
    else
        echo -e "${YELLOW}  ⚠️ Certificat SSL non configuré${NC}"
    fi
else
    echo -e "${RED}❌ Container Nginx n'est pas en cours d'exécution${NC}"
fi

echo ""

# ==============================================================================
# 8. RÉSUMÉ ET RECOMMANDATIONS
# ==============================================================================
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                  RÉSUMÉ DU HEALTH CHECK                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Compter les problèmes
ISSUES=0

# Vérifications
docker ps | grep -q autolink-postgres || ((ISSUES++))
docker ps | grep -q autolink-redis || ((ISSUES++))
docker ps | grep -q autolink-backend || ((ISSUES++))
docker ps | grep -q autolink-frontend || ((ISSUES++))

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les services sont opérationnels${NC}"
    echo ""
    echo "Prochaines vérifications:"
    echo "  - Backups: Vérifiez que les backups automatiques fonctionnent"
    echo "  - Logs: Consultez les logs pour détecter des erreurs"
    echo "  - Performance: Surveillez les temps de réponse"
else
    echo -e "${RED}⚠️ $ISSUES service(s) ont des problèmes${NC}"
    echo ""
    echo "Actions recommandées:"
    echo "  1. Vérifiez les logs: docker-compose logs -f"
    echo "  2. Redémarrez les services: docker-compose restart"
    echo "  3. Contactez le support si le problème persiste"
fi

echo ""
echo -e "${BLUE}Health check terminé à $(date +'%H:%M:%S')${NC}"
echo ""

exit 0
