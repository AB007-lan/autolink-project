# ⚡ INSTALLATION RAPIDE AUTOLINK

## 🚀 Mise en production en 10 minutes

### Étape 1: Prérequis serveur (2 min)

```bash
# Connectez-vous à votre serveur Ubuntu 22.04+
ssh root@votre-serveur

# Installez Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install -y docker-compose

# Vérifiez l'installation
docker --version
docker-compose --version
```

### Étape 2: Déployer Autolink (3 min)

```bash
# Téléchargez et décompressez le projet
cd /home
wget https://votre-stockage.com/autolink-project.zip
unzip autolink-project.zip
cd autolink-project

# Lancez tous les services
docker-compose up -d

# Attendez 30 secondes que tout démarre
sleep 30

# Vérifiez que tout tourne
docker-compose ps
```

### Étape 3: Configuration initiale (5 min)

```bash
# 1. Configurez vos clés API de paiement
nano .env
# Modifiez:
# - BANKILY_MERCHANT_ID et BANKILY_API_KEY
# - MASRVI_MERCHANT_ID et MASRVI_API_KEY  
# - SEDAD_MERCHANT_ID et SEDAD_API_KEY

# 2. Redémarrez le backend pour appliquer
docker-compose restart backend

# 3. Testez l'accès
curl http://localhost:4000/api/v1/health
curl http://localhost:3000
```

### Étape 4: Accédez à votre plateforme! ✅

```
🌐 Site Client: http://votre-ip:3000
🔧 API Backend: http://votre-ip:4000/api/v1
📚 Documentation API: http://votre-ip:4000/api/docs
🗄️ Admin BDD: http://votre-ip:5050

👤 Compte Admin:
   Email: admin@autolink.mr
   Password: AutolinkAdmin2026!
```

---

## 📱 Configuration optionnelle (mais recommandée)

### Domaine et SSL (15 min)

```bash
# Installer Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtenir certificat SSL
sudo certbot --nginx -d autolink.mr -d www.autolink.mr

# Modifier nginx.conf pour activer HTTPS
# Voir le fichier GUIDE_COMPLET_DEPLOIEMENT.md section "Configuration domaine"
```

### Backups automatiques (5 min)

```bash
# Rendre le script exécutable
chmod +x /home/autolink-project/scripts/backup-db.sh

# Tester le backup manuel
/home/autolink-project/scripts/backup-db.sh

# Programmer backup quotidien à 2h du matin
crontab -e
# Ajouter:
0 2 * * * /home/autolink-project/scripts/backup-db.sh
```

### Health check quotidien (2 min)

```bash
# Programmer vérification quotidienne à 8h
crontab -e
# Ajouter:
0 8 * * * /home/autolink-project/scripts/check-health.sh >> /var/log/autolink-health.log
```

---

## 🆘 En cas de problème

### Le site ne charge pas
```bash
docker-compose logs -f frontend
docker-compose restart
```

### L'API ne répond pas
```bash
docker-compose logs -f backend
docker-compose restart backend
```

### La base de données ne démarre pas
```bash
docker-compose logs -f postgres
docker-compose down
docker-compose up -d
```

### Tout redémarrer proprement
```bash
docker-compose down
docker-compose up -d
sleep 30
docker-compose ps
```

---

## 📞 Support

**Documentation complète**: Voir `GUIDE_COMPLET_DEPLOIEMENT.md`

**Contact SMART MS**:
- Email: dev@smartms.mr
- Tel: +222 XX XX XX XX

---

**Félicitations! Votre marketplace Autolink est maintenant en ligne! 🎉**
