# 🔐 AUTOLINK - ACCÈS ET CREDENTIALS

## ⚠️ DOCUMENT CONFIDENTIEL - NE PAS PARTAGER

Ce document contient tous les accès et mots de passe par défaut du système Autolink.  
**Changez immédiatement ces mots de passe en production!**

---

## 🌐 URLs D'ACCÈS

### URLs Locales (après installation)

```
Site Client:          http://localhost:3000
                      http://VOTRE_IP:3000

API Backend:          http://localhost:4000/api/v1
                      http://VOTRE_IP:4000/api/v1

Documentation API:    http://localhost:4000/api/docs
                      http://VOTRE_IP:4000/api/docs

Admin Base Données:   http://localhost:5050
                      http://VOTRE_IP:5050
```

### URLs Production (après configuration domaine)

```
Site Production:      https://autolink.mr
                      https://www.autolink.mr

API Production:       https://autolink.mr/api/v1

Documentation API:    https://autolink.mr/api/docs
```

---

## 👥 COMPTES UTILISATEURS

### 🔴 ADMINISTRATEUR PRINCIPAL

**Accès complet à la plateforme**

```
Rôle:         Admin (Super-utilisateur)
Email:        admin@autolink.mr
Téléphone:    +22220000000
Mot de passe: AutolinkAdmin2026!
```

**Permissions:**
- ✅ Validation des boutiques (KYC)
- ✅ Modération du catalogue
- ✅ Gestion des litiges
- ✅ Accès aux statistiques globales
- ✅ Configuration des commissions
- ✅ Gestion des utilisateurs
- ✅ Logs d'audit complets

**Actions post-installation:**
1. Se connecter sur https://autolink.mr/admin
2. Aller dans "Mon Profil"
3. Changer le mot de passe
4. Activer l'authentification à deux facteurs (2FA)

---

### 🟡 BOUTIQUE DE DÉMO #1

**Boutique de test - Tevragh Zeina**

```
Nom boutique:  Pièces Auto Ahmed
Email:         boutique1@autolink.mr
Téléphone:     +22222123456
Mot de passe:  Boutique2026!
Status:        Vérifiée
Quartier:      Tevragh Zeina
Commission:    5%
```

**Produits existants:**
- Alternateur Toyota Hilux 2.5L (45 000 MRU)
- Phare avant Nissan Patrol (35 000 MRU)

---

### 🟡 BOUTIQUE DE DÉMO #2

**Boutique de test - Capitale**

```
Nom boutique:  Auto Pièces Capitale
Email:         boutique2@autolink.mr
Téléphone:     +22222234567
Mot de passe:  Boutique2026!
Status:        Vérifiée
Quartier:      Capitale
Commission:    5%
```

**Produits existants:**
- Plaquettes de frein Toyota Corolla (12 000 MRU)

---

### 🟢 CLIENT DE DÉMO

**Compte client pour tests**

```
Nom:          Sidi Mohamed
Email:        client@example.mr
Téléphone:    +22222345678
Mot de passe: Client2026!
```

---

## 🗄️ BASE DE DONNÉES

### PostgreSQL - Connexion Directe

```
Host:         localhost (ou IP serveur)
Port:         5432
Database:     autolink_db
Username:     autolink_user
Password:     AutoL1nk@2026!Secure
```

**Chaîne de connexion complète:**
```
postgresql://autolink_user:AutoL1nk@2026!Secure@localhost:5432/autolink_db
```

**Connexion via psql:**
```bash
psql -h localhost -p 5432 -U autolink_user -d autolink_db
# Mot de passe: AutoL1nk@2026!Secure
```

**Connexion depuis Docker:**
```bash
docker exec -it autolink-postgres psql -U autolink_user -d autolink_db
```

---

### PgAdmin - Interface Web

```
URL:          http://localhost:5050
Email:        admin@autolink.mr
Mot de passe: AdminAutolink2026!
```

**Configuration serveur dans PgAdmin:**
```
Name:         Autolink Production
Host:         postgres
Port:         5432
Database:     autolink_db
Username:     autolink_user
Password:     AutoL1nk@2026!Secure
```

---

## 🔴 REDIS CACHE

```
Host:         localhost (ou IP serveur)
Port:         6379
Password:     AutoL1nkR3d1s@2026
Database:     0
```

**Connexion via redis-cli:**
```bash
redis-cli -h localhost -p 6379 -a AutoL1nkR3d1s@2026
```

**Connexion depuis Docker:**
```bash
docker exec -it autolink-redis redis-cli -a AutoL1nkR3d1s@2026
```

---

## 🔑 CLÉS API ET SECRETS

### JWT Authentication

```
JWT_SECRET:              AutoL1nk-JWT-S3cr3t-K3y-2026-V3ry-L0ng-4nd-S3cur3
JWT_REFRESH_SECRET:      AutoL1nk-R3fr3sh-T0k3n-S3cr3t-K3y-2026
JWT_EXPIRATION:          7 jours
JWT_REFRESH_EXPIRATION:  30 jours
```

**⚠️ À CHANGER EN PRODUCTION:**
Générer de nouvelles clés avec:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### Session Secret

```
SESSION_SECRET: AutoL1nk-S3ss10n-S3cr3t-K3y-2026
```

---

## 💳 PAIEMENTS MOBILES (À CONFIGURER)

### Bankily (BPM)

```
API_URL:         https://api.bankily.mr/v1
MERCHANT_ID:     [À OBTENIR]
API_KEY:         [À OBTENIR]
SECRET_KEY:      [À OBTENIR]
WEBHOOK_SECRET:  [À OBTENIR]
```

**Comment obtenir:**
- Email: commercial@bankily.mr
- Tel: +222 XX XX XX XX
- Documents: NIF, Registre Commerce, Statuts

---

### Masrvi (BMCI)

```
API_URL:         https://api.masrvi.mr/merchant
MERCHANT_ID:     [À OBTENIR]
API_KEY:         [À OBTENIR]
SECRET_KEY:      [À OBTENIR]
WEBHOOK_SECRET:  [À OBTENIR]
```

**Comment obtenir:**
- Email: support@masrvi.mr
- Portail: https://merchant.masrvi.mr
- Documents: NIF, Registre Commerce

---

### Sedad (BMI)

```
API_URL:         https://api.sedad.mr/pay
MERCHANT_ID:     [À OBTENIR]
API_KEY:         [À OBTENIR]
SECRET_KEY:      [À OBTENIR]
WEBHOOK_SECRET:  [À OBTENIR]
```

**Comment obtenir:**
- Email: business@sedad.mr
- Tel: +222 XX XX XX XX
- Documentation: https://docs.sedad.mr

---

## 📱 SMS PROVIDER (À CONFIGURER)

### Option recommandée: Twilio

```
ACCOUNT_SID:     [À CRÉER SUR twilio.com]
AUTH_TOKEN:      [À CRÉER SUR twilio.com]
PHONE_NUMBER:    +222XXXXXXXX [À ACHETER]
```

**Inscription:**
1. Aller sur https://www.twilio.com/try-twilio
2. Créer un compte (essai gratuit disponible)
3. Acheter un numéro mauritanien (+222)
4. Récupérer SID et Token dans la console

---

## 📧 EMAIL SMTP (À CONFIGURER)

### Option 1: Gmail (Gratuit, limité)

```
SMTP_HOST:     smtp.gmail.com
SMTP_PORT:     587
SMTP_USER:     autolink@smartms.mr
SMTP_PASSWORD: [MOT DE PASSE D'APPLICATION GMAIL]
```

**Configuration Gmail:**
1. Activer 2FA sur votre compte Gmail
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans la config

---

### Option 2: AWS SES (Recommandé production)

```
SMTP_HOST:     email-smtp.eu-west-1.amazonaws.com
SMTP_PORT:     587
SMTP_USER:     [CRÉER IDENTIFIANTS SMTP SUR AWS]
SMTP_PASSWORD: [CRÉER IDENTIFIANTS SMTP SUR AWS]
```

---

## 🖼️ STOCKAGE IMAGES (À CONFIGURER)

### Option 1: AWS S3 (Recommandé)

```
AWS_ACCESS_KEY_ID:      [À CRÉER SUR AWS]
AWS_SECRET_ACCESS_KEY:  [À CRÉER SUR AWS]
AWS_REGION:             eu-west-1
AWS_S3_BUCKET:          autolink-mauritanie
```

**Configuration:**
1. Créer compte AWS
2. Créer bucket S3 "autolink-mauritanie"
3. Créer utilisateur IAM avec accès S3
4. Récupérer les clés d'accès

---

### Option 2: DigitalOcean Spaces

```
SPACES_ACCESS_KEY:      [À CRÉER SUR DO]
SPACES_SECRET_KEY:      [À CRÉER SUR DO]
SPACES_REGION:          fra1
SPACES_BUCKET:          autolink
SPACES_ENDPOINT:        https://fra1.digitaloceanspaces.com
```

---

## 🔒 SSL/TLS CERTIFICATS

### Let's Encrypt (Gratuit)

```bash
# Obtenir certificat
sudo certbot --nginx -d autolink.mr -d www.autolink.mr

# Emplacement des certificats
/etc/letsencrypt/live/autolink.mr/fullchain.pem
/etc/letsencrypt/live/autolink.mr/privkey.pem

# Auto-renouvellement (configuré automatiquement)
sudo certbot renew --dry-run
```

---

## 📊 MONITORING (Optionnel)

### Google Analytics

```
GA_TRACKING_ID: G-XXXXXXXXXX
```

Créer sur: https://analytics.google.com

---

### Sentry (Error Tracking)

```
SENTRY_DSN: https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

Créer sur: https://sentry.io

---

## 🔄 WEBHOOKS

### URLs de callback pour paiements

```
Bankily: https://autolink.mr/api/v1/payments/webhook/bankily
Masrvi:  https://autolink.mr/api/v1/payments/webhook/masrvi
Sedad:   https://autolink.mr/api/v1/payments/webhook/sedad
```

**À configurer dans les dashboards de chaque provider**

---

## 🛡️ SÉCURITÉ - CHECKLIST

### ⚠️ Actions OBLIGATOIRES avant mise en production:

- [ ] Changer TOUS les mots de passe par défaut
- [ ] Générer de nouvelles clés JWT avec `crypto.randomBytes(64)`
- [ ] Activer HTTPS/SSL avec Let's Encrypt
- [ ] Configurer firewall (bloquer ports sauf 80, 443, 22)
- [ ] Désactiver l'accès root SSH
- [ ] Créer utilisateur système non-root
- [ ] Configurer fail2ban contre brute-force
- [ ] Activer 2FA pour compte admin
- [ ] Mettre en place backups automatiques quotidiens
- [ ] Tester la restauration d'un backup
- [ ] Vérifier les logs d'accès régulièrement
- [ ] Mettre à jour Docker et le système régulièrement

---

## 📝 NOTES IMPORTANTES

1. **Ce fichier est CONFIDENTIEL**
   - Ne JAMAIS le commiter dans Git
   - Ne JAMAIS le partager publiquement
   - Le stocker dans un gestionnaire de mots de passe sécurisé

2. **Rotation des secrets**
   - Changer les mots de passe tous les 90 jours
   - Changer les clés API si suspicion de compromission
   - Auditer les accès régulièrement

3. **Accès d'urgence**
   - Garder une copie papier des credentials admin dans un coffre
   - Configurer un email de récupération
   - Avoir un plan de reprise d'activité documenté

---

## 📞 SUPPORT D'URGENCE

**En cas de compromission de sécurité:**

1. Déconnectez immédiatement le serveur d'Internet
2. Contactez SMART MS: +222 XX XX XX XX
3. Ne redémarrez PAS les services avant investigation
4. Conservez tous les logs

**Équipe technique SMART MS:**
- Email urgence: security@smartms.mr
- Tel 24/7: +222 XX XX XX XX
- WhatsApp: +222 XX XX XX XX

---

**Document généré le:** 11 Avril 2026  
**Version:** 1.0  
**Classification:** CONFIDENTIEL

---

**🔐 GARDEZ CE DOCUMENT EN SÉCURITÉ! 🔐**
