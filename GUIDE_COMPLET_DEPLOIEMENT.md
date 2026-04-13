# AUTOLINK - PROJET COMPLET CLÉ EN MAIN
## Marketplace de pièces détachées automobiles - Mauritanie

**Date de livraison**: 11 Avril 2026  
**Version**: 1.0 - Production Ready  
**Client**: SMART MS - Nouakchott, Mauritanie  
**Status**: ✅ PRÊT POUR DÉPLOIEMENT

---

## 📦 CONTENU DU PACKAGE

Ce package contient l'intégralité du projet Autolink prêt à être déployé:

✅ **Base de données PostgreSQL** - Schéma complet + données initiales  
✅ **Backend API** - NestJS avec tous les modules fonctionnels  
✅ **Frontend Web** - Next.js responsive (Client + Boutique + Admin)  
✅ **Configuration Docker** - Déploiement en 1 commande  
✅ **Documentation complète** - Installation, configuration, utilisation  
✅ **Comptes par défaut** - Admin, boutiques demo, client demo  
✅ **Scripts de maintenance** - Backup, monitoring, logs  

---

## 🚀 DÉMARRAGE RAPIDE (5 MINUTES)

### Prérequis système

```bash
# Serveur Ubuntu 22.04+ ou similaire
# Minimum: 2 CPU, 4GB RAM, 40GB disque
# Recommandé: 4 CPU, 8GB RAM, 100GB disque

# Installer Docker et Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install -y docker-compose
```

### Installation en 1 commande

```bash
# 1. Décompresser le projet
cd /home/autolink
unzip autolink-project-complete.zip
cd autolink-project

# 2. Lancer tous les services
docker-compose up -d

# 3. Attendre 30 secondes que tout démarre
sleep 30

# 4. Vérifier que tout fonctionne
docker-compose ps
```

**C'EST TOUT! L'application est maintenant accessible:**

- 🌐 **Site client**: http://votre-serveur:3000
- 🔧 **API Backend**: http://votre-serveur:4000/api/v1
- 📚 **Documentation API**: http://votre-serveur:4000/api/docs
- 🗄️ **Admin Base de données**: http://votre-serveur:5050

---

## 🔐 COMPTES PAR DÉFAUT

### Administrateur Plateforme

```
Email: admin@autolink.mr
Téléphone: +22220000000
Mot de passe: AutolinkAdmin2026!
Rôle: Admin complet (validation boutiques, modération, stats)
```

### Boutique 1 - Tevragh Zeina

```
Nom: Pièces Auto Ahmed
Email: boutique1@autolink.mr
Téléphone: +22222123456
Mot de passe: Boutique2026!
Status: Vérifiée
Quartier: Tevragh Zeina
```

### Boutique 2 - Capitale

```
Nom: Auto Pièces Capitale
Email: boutique2@autolink.mr
Téléphone: +22222234567
Mot de passe: Boutique2026!
Status: Vérifiée
Quartier: Capitale
```

### Client Demo

```
Nom: Sidi Mohamed
Email: client@example.mr
Téléphone: +22222345678
Mot de passe: Client2026!
```

### PgAdmin (Gestion base de données)

```
URL: http://votre-serveur:5050
Email: admin@autolink.mr
Mot de passe: AdminAutolink2026!
```

---

## 📊 CONFIGURATION BASE DE DONNÉES

### Connexion PostgreSQL

```env
Host: localhost (ou IP serveur)
Port: 5432
Database: autolink_db
Username: autolink_user
Password: AutoL1nk@2026!Secure
```

### Statistiques initiales

- ✅ 15 marques de véhicules (Toyota, Nissan, Peugeot, etc.)
- ✅ 50+ modèles populaires en Mauritanie
- ✅ 1000+ années-véhicules (2010-2026)
- ✅ 10 catégories principales de pièces
- ✅ 30+ sous-catégories détaillées
- ✅ 3 produits de démonstration
- ✅ 2 boutiques vérifiées
- ✅ 4 comptes utilisateurs

---

## ⚙️ CONFIGURATION DES PAIEMENTS

**IMPORTANT**: Vous devez remplacer les clés API de test par vos vraies clés.

### Fichier: backend/.env

```env
# BANKILY
BANKILY_API_URL=https://api.bankily.mr/v1
BANKILY_MERCHANT_ID=VOTRE_ID_MARCHAND_BANKILY
BANKILY_API_KEY=VOTRE_CLE_API_BANKILY

# MASRVI
MASRVI_API_URL=https://api.masrvi.mr/merchant
MASRVI_MERCHANT_ID=VOTRE_ID_MARCHAND_MASRVI
MASRVI_API_KEY=VOTRE_CLE_API_MASRVI

# SEDAD
SEDAD_API_URL=https://api.sedad.mr/pay
SEDAD_MERCHANT_ID=VOTRE_ID_MARCHAND_SEDAD
SEDAD_API_KEY=VOTRE_CLE_API_SEDAD
```

### Comment obtenir les clés

1. **Bankily (BPM)**
   - Contactez: commercial@bankily.mr
   - Demandez un compte marchand e-commerce
   - Délai: 3-5 jours ouvrables

2. **Masrvi (BMCI)**
   - Contactez: support@masrvi.mr
   - Inscription: https://merchant.masrvi.mr
   - Délai: 5-7 jours ouvrables

3. **Sedad (BMI)**
   - Contactez: business@sedad.mr
   - Documentation: https://docs.sedad.mr
   - Délai: 3-5 jours ouvrables

---

## 📱 CONFIGURATION SMS

Pour l'envoi des codes OTP de vérification:

```env
# Option 1: Twilio (International)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=VOTRE_SID_TWILIO
TWILIO_AUTH_TOKEN=VOTRE_TOKEN_TWILIO
TWILIO_PHONE_NUMBER=+222XXXXXXXX

# Option 2: Provider local mauritanien
SMS_PROVIDER=local
SMS_API_URL=https://api.sms-mauritanie.mr
SMS_API_KEY=VOTRE_CLE_API
```

---

## 📧 CONFIGURATION EMAIL

Pour les notifications par email:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=autolink@smartms.mr
SMTP_PASSWORD=VOTRE_MOT_DE_PASSE_APP_GMAIL

# OU utiliser un service mauritanien
SMTP_HOST=smtp.votre-hebergeur.mr
SMTP_PORT=587
SMTP_USER=noreply@autolink.mr
SMTP_PASSWORD=VOTRE_MOT_DE_PASSE
```

---

## 🖼️ CONFIGURATION STOCKAGE IMAGES

Les images des produits peuvent être stockées:

### Option 1: AWS S3 (Recommandé)

```env
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=VOTRE_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=VOTRE_SECRET_KEY
AWS_REGION=eu-west-1
AWS_S3_BUCKET=autolink-mauritanie
```

### Option 2: DigitalOcean Spaces

```env
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=VOTRE_SPACES_KEY
AWS_SECRET_ACCESS_KEY=VOTRE_SPACES_SECRET
AWS_REGION=fra1
AWS_S3_BUCKET=autolink
AWS_ENDPOINT=https://fra1.digitaloceanspaces.com
```

### Option 3: Stockage local (Développement uniquement)

```env
STORAGE_PROVIDER=local
UPLOAD_PATH=/app/uploads
```

---

## 🌐 CONFIGURATION DOMAINE ET SSL

### Étape 1: Pointer votre domaine

Ajoutez un enregistrement DNS de type A:

```
Type: A
Nom: @ (ou autolink)
Valeur: IP_DE_VOTRE_SERVEUR
TTL: 3600
```

Résultat: autolink.mr → votre serveur

### Étape 2: Obtenir un certificat SSL gratuit

```bash
# Installer Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d autolink.mr -d www.autolink.mr

# Auto-renouvellement (automatique)
sudo certbot renew --dry-run
```

### Étape 3: Modifier le fichier nginx.conf

```nginx
# Fichier: nginx/nginx.conf

server {
    listen 80;
    server_name autolink.mr www.autolink.mr;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name autolink.mr www.autolink.mr;
    
    ssl_certificate /etc/letsencrypt/live/autolink.mr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/autolink.mr/privkey.pem;
    
    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API
    location /api {
        proxy_pass http://backend:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket pour chat
    location /socket.io {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Étape 4: Redémarrer Nginx

```bash
docker-compose restart nginx
```

**Votre site sera maintenant accessible en HTTPS:**  
https://autolink.mr ✅

---

## 📋 COMMANDES DE GESTION

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Backend seulement
docker-compose logs -f backend

# Frontend seulement
docker-compose logs -f frontend

# Base de données
docker-compose logs -f postgres
```

### Redémarrer un service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart nginx
```

### Arrêter tous les services

```bash
docker-compose down
```

### Démarrer tous les services

```bash
docker-compose up -d
```

### Mettre à jour le code

```bash
# Backend
cd backend
git pull
docker-compose build backend
docker-compose restart backend

# Frontend
cd frontend
git pull
docker-compose build frontend
docker-compose restart frontend
```

---

## 💾 BACKUP ET RESTAURATION

### Backup automatique de la base de données

```bash
# Script: scripts/backup-db.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/autolink/backups"
mkdir -p $BACKUP_DIR

docker exec autolink-postgres pg_dump \
  -U autolink_user \
  -d autolink_db \
  -F c \
  -f /tmp/autolink_$DATE.dump

docker cp autolink-postgres:/tmp/autolink_$DATE.dump \
  $BACKUP_DIR/autolink_$DATE.dump

# Garder seulement les 7 derniers backups
ls -t $BACKUP_DIR/autolink_*.dump | tail -n +8 | xargs rm -f

echo "Backup terminé: autolink_$DATE.dump"
```

### Programmer le backup quotidien

```bash
# Ajouter au crontab
crontab -e

# Ajouter cette ligne (backup tous les jours à 2h du matin)
0 2 * * * /home/autolink/scripts/backup-db.sh
```

### Restaurer un backup

```bash
# Copier le backup dans le container
docker cp /home/autolink/backups/autolink_20260411.dump \
  autolink-postgres:/tmp/restore.dump

# Restaurer
docker exec autolink-postgres pg_restore \
  -U autolink_user \
  -d autolink_db \
  -c \
  /tmp/restore.dump
```

---

## 📈 MONITORING ET MAINTENANCE

### Vérifier l'état des services

```bash
# Script: scripts/check-health.sh

#!/bin/bash

echo "=== AUTOLINK HEALTH CHECK ==="
echo ""

# Check Docker containers
echo "Docker Containers:"
docker-compose ps

echo ""
echo "Disk Usage:"
df -h | grep -E "Filesystem|/dev"

echo ""
echo "Memory Usage:"
free -h

echo ""
echo "Backend API:"
curl -s http://localhost:4000/api/v1/health | jq .

echo ""
echo "Frontend:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000

echo ""
echo "Database:"
docker exec autolink-postgres pg_isready -U autolink_user
```

### Nettoyer les images Docker inutilisées

```bash
docker system prune -a -f
docker volume prune -f
```

---

## 🔧 TROUBLESHOOTING

### Problème: Le site ne charge pas

```bash
# 1. Vérifier que tous les containers tournent
docker-compose ps

# 2. Vérifier les logs
docker-compose logs -f frontend
docker-compose logs -f backend

# 3. Redémarrer les services
docker-compose restart
```

### Problème: Erreur de connexion à la base de données

```bash
# 1. Vérifier que PostgreSQL tourne
docker-compose ps postgres

# 2. Tester la connexion
docker exec -it autolink-postgres psql \
  -U autolink_user \
  -d autolink_db \
  -c "SELECT COUNT(*) FROM users;"

# 3. Redémarrer PostgreSQL
docker-compose restart postgres
```

### Problème: Les images ne s'affichent pas

```bash
# 1. Vérifier les permissions du dossier uploads
ls -la backend/uploads

# 2. Créer le dossier si nécessaire
mkdir -p backend/uploads
chmod 777 backend/uploads

# 3. Redémarrer le backend
docker-compose restart backend
```

### Problème: Les paiements ne fonctionnent pas

```bash
# 1. Vérifier les variables d'environnement
docker exec autolink-backend env | grep -E "BANKILY|MASRVI|SEDAD"

# 2. Vérifier les logs de paiement
docker-compose logs backend | grep -i payment

# 3. Tester l'API de paiement en mode sandbox
curl -X POST http://localhost:4000/api/v1/payments/test
```

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

### Semaine 1: Configuration initiale

- ✅ Déployer le projet sur votre serveur
- ✅ Configurer votre nom de domaine (autolink.mr)
- ✅ Obtenir le certificat SSL
- ✅ Configurer les clés API de paiement
- ✅ Tester tous les parcours utilisateurs

### Semaine 2: Contenu

- 📝 Ajouter plus de marques et modèles de véhicules
- 📝 Créer les catégories de pièces spécifiques
- 📝 Rédiger les CGU et CGV
- 📝 Préparer les templates d'emails

### Semaine 3-4: Acquisition boutiques

- 📞 Démarcher 20-30 boutiques à Tevragh Zeina, Capitale, Ksar
- 🎓 Former les vendeurs à l'utilisation de la plateforme
- 📸 Aider les boutiques à photographier leurs pièces
- ✅ Valider les 10 premières boutiques pilotes

### Mois 2: Lancement public

- 📱 Campagne réseaux sociaux (Facebook, Instagram)
- 📻 Communication radio locale
- 🎁 Promotions de lancement
- 📊 Monitoring quotidien des metrics

---

## 📞 SUPPORT TECHNIQUE

### Documentation en ligne

- **Site officiel**: https://autolink.mr/docs
- **API Documentation**: https://autolink.mr/api/docs
- **Vidéos tutoriels**: https://youtube.com/@autolink-mauritanie

### Contacts SMART MS

- **Email**: dev@smartms.mr
- **Téléphone**: +222 XX XX XX XX
- **WhatsApp**: +222 XX XX XX XX

### Heures de support

- Lundi - Vendredi: 9h - 18h (GMT)
- Samedi: 9h - 13h (GMT)
- Support d'urgence 24/7 pour incidents critiques

---

## 📄 LICENCE ET PROPRIÉTÉ

**Propriétaire**: SMART MS, Nouakchott, Mauritanie  
**Projet**: Autolink Marketplace  
**Licence**: Propriétaire - Tous droits réservés  
**Date**: Avril 2026

Ce logiciel et sa documentation sont la propriété exclusive de SMART MS.  
Toute reproduction, modification ou distribution non autorisée est strictement interdite.

---

## ✅ CHECKLIST DE DÉPLOIEMENT

Cochez au fur et à mesure:

- [ ] Serveur provisionné (2+ CPU, 4+ GB RAM)
- [ ] Docker et Docker Compose installés
- [ ] Projet décompressé et déployé
- [ ] Tous les containers démarrés avec succès
- [ ] Domaine configuré et pointant vers le serveur
- [ ] Certificat SSL obtenu et configuré
- [ ] Clés API Bankily configurées
- [ ] Clés API Masrvi configurées
- [ ] Clés API Sedad configurées
- [ ] SMS provider configuré
- [ ] Email SMTP configuré
- [ ] Stockage images configuré (S3 ou local)
- [ ] Tests de connexion admin OK
- [ ] Tests de connexion boutique OK
- [ ] Tests de connexion client OK
- [ ] Test de recherche de produits OK
- [ ] Test d'ajout au panier OK
- [ ] Test de paiement (mode test) OK
- [ ] Test de livraison OK
- [ ] Test de messagerie OK
- [ ] Backup automatique configuré
- [ ] Monitoring configuré
- [ ] Documentation lue et comprise
- [ ] Formation équipe effectuée

---

**🎉 FÉLICITATIONS!**

Votre plateforme Autolink est maintenant opérationnelle et prête à révolutionner le marché mauritanien des pièces détachées automobiles!

**Bon lancement! 🚀**
