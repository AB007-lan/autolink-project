# 🚗 AUTOLINK - Marketplace Pièces Détachées Automobiles

> **Plateforme de mise en relation entre vendeurs professionnels et acheteurs de pièces automobiles en Mauritanie**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/smartms/autolink)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production_Ready-green.svg)](https://autolink.mr)

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation rapide](#installation-rapide)
- [Documentation](#documentation)
- [Support](#support)

---

## 🎯 Présentation

**Autolink** digitalise le marché traditionnel des pièces détachées automobiles à Nouakchott en offrant:

- 🔍 **Recherche intelligente** par marque/modèle/année
- 💳 **Paiements mobiles locaux** (Bankily, Masrvi, Sedad)
- 🏪 **Catalogue centralisé** de toutes les boutiques
- 📱 **Interface responsive** adaptée aux mobiles
- ✅ **Compatibilité garantie** véhicule/pièce

---

## ✨ Fonctionnalités

### Pour les Clients

- ✅ Recherche de pièces par véhicule (marque, modèle, année)
- ✅ Comparaison des prix entre boutiques
- ✅ Filtres avancés (neuf/occasion, quartier, prix)
- ✅ Paiement mobile (Bankily, Masrvi, Sedad) ou à la livraison
- ✅ Messagerie directe avec les vendeurs
- ✅ Suivi de commande en temps réel
- ✅ Historique et favoris

### Pour les Boutiques

- ✅ Gestion de catalogue simplifiée
- ✅ Upload photos depuis mobile
- ✅ Gestion des stocks en temps réel
- ✅ Réception et traitement des commandes
- ✅ Messagerie clients intégrée
- ✅ Statistiques de ventes
- ✅ Tableau de bord complet

### Pour les Administrateurs

- ✅ Validation KYC des boutiques
- ✅ Modération du catalogue
- ✅ Gestion des litiges
- ✅ Dashboard analytics complet
- ✅ Configuration commissions
- ✅ Audit logs

---

## 🛠️ Technologies

### Backend

- **Framework**: NestJS (Node.js + TypeScript)
- **Base de données**: PostgreSQL 15
- **Cache**: Redis
- **WebSocket**: Socket.io (messagerie temps réel)
- **File d'attente**: Bull (jobs asynchrones)

### Frontend

- **Framework**: Next.js 14 (React + TypeScript)
- **UI**: TailwindCSS + shadcn/ui
- **State**: React Query
- **Forms**: React Hook Form + Zod

### Infrastructure

- **Containerisation**: Docker + Docker Compose
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **Monitoring**: Built-in health checks

### Intégrations

- **Paiements**: Bankily, Masrvi, Sedad APIs
- **SMS**: Twilio (ou provider local)
- **Email**: SMTP (Gmail, AWS SES, ou local)
- **Stockage**: AWS S3 / DigitalOcean Spaces

---

## 🚀 Installation rapide

### Prérequis

```bash
- Ubuntu 22.04+ (ou équivalent)
- Docker 20.10+
- Docker Compose 1.29+
- 2+ CPU, 4+ GB RAM, 40+ GB disque
```

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/smartms/autolink.git
cd autolink

# 2. Lancer avec Docker Compose
docker-compose up -d

# 3. Attendre que tous les services démarrent
docker-compose ps

# 4. Accéder à l'application
# Frontend: http://localhost:3000
# API: http://localhost:4000/api/v1
# Documentation API: http://localhost:4000/api/docs
# PgAdmin: http://localhost:5050
```

### Comptes par défaut

```
Admin:
- Email: admin@autolink.mr
- Password: AutolinkAdmin2026!

Boutique Demo:
- Email: boutique1@autolink.mr
- Password: Boutique2026!

Client Demo:
- Email: client@example.mr
- Password: Client2026!
```

---

## 📚 Documentation

### Documentation complète

📖 **[GUIDE COMPLET DE DÉPLOIEMENT](GUIDE_COMPLET_DEPLOIEMENT.md)**

Ce guide contient:
- Installation détaillée
- Configuration des paiements
- Configuration domaine et SSL
- Gestion et maintenance
- Troubleshooting
- Scripts de backup

### Autres documents

- 📄 [Cahier des charges](docs/CAHIER_DES_CHARGES.pdf)
- 🏗️ [Architecture technique](docs/ARCHITECTURE.md)
- 🔌 [Documentation API](http://localhost:4000/api/docs)
- 📱 [Guide utilisateur client](docs/GUIDE_CLIENT.md)
- 🏪 [Guide utilisateur boutique](docs/GUIDE_BOUTIQUE.md)
- ⚙️ [Guide administrateur](docs/GUIDE_ADMIN.md)

---

## 🏗️ Structure du projet

```
autolink-project/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── users/         # Users management
│   │   │   ├── boutiques/     # Shops management
│   │   │   ├── catalog/       # Products catalog
│   │   │   ├── orders/        # Orders management
│   │   │   ├── payments/      # Payment processing
│   │   │   └── messaging/     # Real-time chat
│   │   ├── common/            # Shared utilities
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Application Next.js
│   ├── app/
│   │   ├── (client)/          # Client pages
│   │   ├── (boutique)/        # Shop dashboard
│   │   └── (admin)/           # Admin backoffice
│   ├── components/
│   ├── lib/
│   ├── Dockerfile
│   └── package.json
│
├── database/                   # SQL scripts
│   ├── init.sql               # Schema creation
│   └── seed.sql               # Initial data
│
├── nginx/                      # Nginx configuration
│   ├── nginx.conf
│   └── ssl/
│
├── scripts/                    # Maintenance scripts
│   ├── backup-db.sh
│   ├── check-health.sh
│   └── deploy.sh
│
├── docker-compose.yml          # Services orchestration
└── README.md                   # This file
```

---

## 📊 Base de données

### Schéma principal

```
users                   → Utilisateurs (clients, boutiques, admins)
boutiques              → Boutiques/Vendeurs
categories             → Catégories de pièces
vehicle_brands         → Marques véhicules
vehicle_models         → Modèles véhicules
vehicle_years          → Années véhicules
products               → Catalogue produits
product_compatibilities → Compatibilité pièce/véhicule
orders                 → Commandes
order_items            → Détails commandes
transactions           → Transactions paiement
conversations          → Conversations chat
messages               → Messages
reviews                → Avis clients
favorites              → Produits favoris
notifications          → Notifications
audit_logs             → Logs d'audit
```

### Données initiales (seed)

- 15 marques de véhicules
- 50+ modèles populaires
- 1000+ combinaisons marque/modèle/année
- 10 catégories + 30 sous-catégories
- 2 boutiques de démo vérifiées
- 3 produits de démo
- 4 comptes utilisateurs de test

---

## 🔒 Sécurité

- ✅ HTTPS obligatoire (TLS 1.2+)
- ✅ Authentification JWT
- ✅ Hashage bcrypt (passwords)
- ✅ Protection CSRF
- ✅ Rate limiting sur API
- ✅ Validation stricte des inputs
- ✅ Sanitization SQL (TypeORM)
- ✅ Headers sécurité (Helmet)
- ✅ CORS configuré

---

## 📈 Monitoring

### Health Checks

```bash
# Vérifier l'état global
docker-compose ps

# Vérifier l'API
curl http://localhost:4000/api/v1/health

# Vérifier la base de données
docker exec autolink-postgres pg_isready
```

### Logs

```bash
# Tous les services
docker-compose logs -f

# Backend uniquement
docker-compose logs -f backend

# Frontend uniquement
docker-compose logs -f frontend
```

---

## 🔄 Maintenance

### Backup base de données

```bash
# Manuel
./scripts/backup-db.sh

# Automatique (crontab)
0 2 * * * /home/autolink/scripts/backup-db.sh
```

### Mise à jour

```bash
# Pull derniers changements
git pull origin main

# Rebuild containers
docker-compose build

# Redéployer
docker-compose down
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Le site ne charge pas

```bash
docker-compose ps              # Vérifier les services
docker-compose logs -f         # Voir les logs
docker-compose restart         # Redémarrer tout
```

### Erreur base de données

```bash
docker-compose restart postgres
docker exec -it autolink-postgres psql -U autolink_user -d autolink_db
```

### Images ne s'affichent pas

```bash
chmod 777 backend/uploads
docker-compose restart backend
```

---

## 📞 Support

### Documentation

- 📖 Guide complet: [GUIDE_COMPLET_DEPLOIEMENT.md](GUIDE_COMPLET_DEPLOIEMENT.md)
- 🔌 API Docs: http://localhost:4000/api/docs

### Contact

- **Email**: dev@smartms.mr
- **Téléphone**: +222 XX XX XX XX
- **Site**: https://smartms.mr

### Heures

- Lundi - Vendredi: 9h - 18h GMT
- Support urgence 24/7 pour incidents critiques

---

## 📝 Licence

**Propriétaire** - SMART MS, Nouakchott, Mauritanie

Ce projet et tous ses composants sont la propriété exclusive de SMART MS.  
Toute utilisation, reproduction ou distribution non autorisée est interdite.

Copyright © 2026 SMART MS. Tous droits réservés.

---

## 🙏 Remerciements

Développé avec ❤️ par l'équipe **SMART MS** pour révolutionner le marché automobile mauritanien.

---

**🚀 Bon lancement!**
