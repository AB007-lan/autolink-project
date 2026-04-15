-- =====================================================
-- AUTOLINK DATABASE SEED DATA
-- Données initiales pour démarrage production
-- =====================================================

-- =====================================================
-- 1. CATÉGORIES DE PIÈCES
-- =====================================================

-- Catégories principales
INSERT INTO categories (id, name, slug, display_order, description) VALUES
(1, 'Moteur', 'moteur', 1, 'Pièces du système moteur'),
(2, 'Transmission', 'transmission', 2, 'Boîte de vitesses et embrayage'),
(3, 'Freinage', 'freinage', 3, 'Système de freinage complet'),
(4, 'Suspension', 'suspension', 4, 'Amortisseurs et ressorts'),
(5, 'Électricité', 'electricite', 5, 'Composants électriques et électroniques'),
(6, 'Carrosserie', 'carrosserie', 6, 'Éléments de carrosserie et pare-chocs'),
(7, 'Intérieur', 'interieur', 7, 'Habitacle et accessoires intérieurs'),
(8, 'Climatisation', 'climatisation', 8, 'Système de climatisation'),
(9, 'Échappement', 'echappement', 9, 'Ligne d''échappement complète'),
(10, 'Filtration', 'filtration', 10, 'Filtres à air, huile, carburant');

-- Sous-catégories MOTEUR
INSERT INTO categories (parent_id, name, slug, display_order) VALUES
(1, 'Alternateur', 'alternateur', 1),
(1, 'Démarreur', 'demarreur', 2),
(1, 'Courroie de distribution', 'courroie-distribution', 3),
(1, 'Pompe à eau', 'pompe-eau', 4),
(1, 'Turbo', 'turbo', 5),
(1, 'Injecteurs', 'injecteurs', 6),
(1, 'Culasse', 'culasse', 7),
(1, 'Joint de culasse', 'joint-culasse', 8);

-- Sous-catégories FREINAGE
INSERT INTO categories (parent_id, name, slug, display_order) VALUES
(3, 'Plaquettes de frein', 'plaquettes-frein', 1),
(3, 'Disques de frein', 'disques-frein', 2),
(3, 'Étriers de frein', 'etriers-frein', 3),
(3, 'Maître-cylindre', 'maitre-cylindre', 4),
(3, 'Liquide de frein', 'liquide-frein', 5);

-- Sous-catégories CARROSSERIE
INSERT INTO categories (parent_id, name, slug, display_order) VALUES
(6, 'Pare-chocs avant', 'pare-chocs-avant', 1),
(6, 'Pare-chocs arrière', 'pare-chocs-arriere', 2),
(6, 'Phares avant', 'phares-avant', 3),
(6, 'Feux arrière', 'feux-arriere', 4),
(6, 'Rétroviseurs', 'retroviseurs', 5),
(6, 'Capot', 'capot', 6),
(6, 'Ailes', 'ailes', 7),
(6, 'Portes', 'portes', 8);

-- =====================================================
-- 2. MARQUES DE VÉHICULES (TOUTES MARQUES EN MAURITANIE)
-- =====================================================

INSERT INTO vehicle_brands (id, name, display_order) VALUES
-- Japonaises
(1,  'Toyota',        1),
(2,  'Nissan',        2),
(3,  'Mitsubishi',    3),
(4,  'Honda',         4),
(5,  'Isuzu',         5),
(6,  'Mazda',         6),
(7,  'Suzuki',        7),
(8,  'Hino',          8),
-- Coréennes
(9,  'Hyundai',       9),
(10, 'Kia',           10),
(11, 'SsangYong',     11),
-- Françaises
(12, 'Peugeot',       12),
(13, 'Renault',       13),
(14, 'Dacia',         14),
(15, 'Citroën',       15),
-- Allemandes
(16, 'Mercedes-Benz', 16),
(17, 'BMW',           17),
(18, 'Volkswagen',    18),
-- Britanniques
(19, 'Land Rover',    19),
-- Américaines
(20, 'Ford',          20),
(21, 'Jeep',          21),
(22, 'Chevrolet',     22),
(23, 'Dodge',         23),
-- Italiennes
(24, 'Fiat',          24),
(25, 'Iveco',         25),
-- Chinoises
(26, 'Chery',         26),
(27, 'JAC',           27),
(28, 'Great Wall',    28),
(29, 'Geely',         29),
(30, 'Haval',         30),
(31, 'Changan',       31),
(32, 'BYD',           32),
-- Indiennes
(33, 'Tata',          33),
-- Poids lourds européens
(34, 'Volvo',         34),
(35, 'MAN',           35)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

-- =====================================================
-- 3. MODÈLES PAR MARQUE
-- =====================================================

-- Toyota
INSERT INTO vehicle_models (brand_id, name) VALUES
(1, 'Corolla'), (1, 'Camry'), (1, 'Yaris'), (1, 'Auris'), (1, 'Avensis'),
(1, 'HiLux'), (1, 'Land Cruiser'), (1, 'Land Cruiser Prado'), (1, 'Fortuner'),
(1, 'RAV4'), (1, 'HiAce'), (1, 'Innova'), (1, 'Rush'), (1, 'Sequoia')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Nissan
INSERT INTO vehicle_models (brand_id, name) VALUES
(2, 'Patrol'), (2, 'Navara'), (2, 'Frontier'), (2, 'Pathfinder'), (2, 'Terrano'),
(2, 'X-Trail'), (2, 'Qashqai'), (2, 'Murano'), (2, 'Juke'),
(2, 'Sunny'), (2, 'Sentra'), (2, 'Micra'), (2, 'Tiida')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mitsubishi
INSERT INTO vehicle_models (brand_id, name) VALUES
(3, 'L200'), (3, 'Pajero'), (3, 'Montero'), (3, 'L300'),
(3, 'Outlander'), (3, 'ASX'), (3, 'Eclipse Cross'),
(3, 'Galant'), (3, 'Lancer'), (3, 'Colt')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Honda
INSERT INTO vehicle_models (brand_id, name) VALUES
(4, 'Civic'), (4, 'Accord'), (4, 'City'), (4, 'Jazz'),
(4, 'CR-V'), (4, 'HR-V'), (4, 'BR-V'), (4, 'Pilot')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Isuzu
INSERT INTO vehicle_models (brand_id, name) VALUES
(5, 'D-Max'), (5, 'MU-X'), (5, 'NPR'), (5, 'NKR'), (5, 'NQR'), (5, 'FTR')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mazda
INSERT INTO vehicle_models (brand_id, name) VALUES
(6, 'Mazda 2'), (6, 'Mazda 3'), (6, 'Mazda 6'),
(6, 'CX-3'), (6, 'CX-5'), (6, 'CX-9'), (6, 'BT-50')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Suzuki
INSERT INTO vehicle_models (brand_id, name) VALUES
(7, 'Jimny'), (7, 'Grand Vitara'), (7, 'Vitara'),
(7, 'Swift'), (7, 'Baleno'), (7, 'Alto'), (7, 'Ertiga'), (7, 'SX4')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Hino
INSERT INTO vehicle_models (brand_id, name) VALUES
(8, 'Dutro (300)'), (8, '500 Series'), (8, '700 Series')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Hyundai
INSERT INTO vehicle_models (brand_id, name) VALUES
(9, 'Accent'), (9, 'Elantra'), (9, 'Sonata'),
(9, 'i10'), (9, 'Grand i10'), (9, 'i20'), (9, 'i30'),
(9, 'Tucson'), (9, 'Santa Fe'), (9, 'Creta'), (9, 'Kona'), (9, 'Venue'),
(9, 'H-1'), (9, 'HD65'), (9, 'HD78')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Kia
INSERT INTO vehicle_models (brand_id, name) VALUES
(10, 'Picanto'), (10, 'Rio'), (10, 'Cerato'), (10, 'K5'),
(10, 'Sportage'), (10, 'Sorento'), (10, 'Seltos'), (10, 'Stonic'), (10, 'Telluride'),
(10, 'Carnival'), (10, 'Bongo')
ON CONFLICT (brand_id, name) DO NOTHING;

-- SsangYong
INSERT INTO vehicle_models (brand_id, name) VALUES
(11, 'Rexton'), (11, 'Korando'), (11, 'Actyon'), (11, 'Tivoli'), (11, 'Musso')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Peugeot
INSERT INTO vehicle_models (brand_id, name) VALUES
(12, '106'), (12, '206'), (12, '207'), (12, '208'), (12, '301'),
(12, '308'), (12, '408'), (12, '508'), (12, '2008'), (12, '3008'), (12, '5008'),
(12, 'Partner'), (12, 'Expert'), (12, 'Boxer'), (12, 'Rifter')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Renault
INSERT INTO vehicle_models (brand_id, name) VALUES
(13, 'Clio'), (13, 'Megane'), (13, 'Laguna'), (13, 'Scenic'), (13, 'Talisman'),
(13, 'Duster'), (13, 'Captur'), (13, 'Kadjar'), (13, 'Koleos'),
(13, 'Logan'), (13, 'Sandero'), (13, 'Kangoo'), (13, 'Trafic'), (13, 'Master')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Dacia
INSERT INTO vehicle_models (brand_id, name) VALUES
(14, 'Duster'), (14, 'Logan'), (14, 'Sandero'), (14, 'Lodgy'), (14, 'Dokker'), (14, 'Spring')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Citroën
INSERT INTO vehicle_models (brand_id, name) VALUES
(15, 'C2'), (15, 'C3'), (15, 'C4'), (15, 'C-Elysée'), (15, 'C5 Aircross'),
(15, 'Berlingo'), (15, 'Jumpy'), (15, 'Jumper'), (15, 'SpaceTourer')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Mercedes-Benz
INSERT INTO vehicle_models (brand_id, name) VALUES
(16, 'A-Class'), (16, 'C-Class'), (16, 'E-Class'), (16, 'S-Class'),
(16, 'GLA'), (16, 'GLC'), (16, 'GLE'), (16, 'GLS'), (16, 'G-Class'),
(16, 'Sprinter'), (16, 'Vito'), (16, 'Viano'), (16, 'Actros'), (16, 'Axor')
ON CONFLICT (brand_id, name) DO NOTHING;

-- BMW
INSERT INTO vehicle_models (brand_id, name) VALUES
(17, 'Série 1'), (17, 'Série 3'), (17, 'Série 5'), (17, 'Série 7'),
(17, 'X1'), (17, 'X3'), (17, 'X5'), (17, 'X6'), (17, 'X7')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Volkswagen
INSERT INTO vehicle_models (brand_id, name) VALUES
(18, 'Polo'), (18, 'Golf'), (18, 'Passat'), (18, 'Jetta'),
(18, 'T-Cross'), (18, 'T-Roc'), (18, 'Tiguan'), (18, 'Touareg'),
(18, 'Caddy'), (18, 'Transporter'), (18, 'Crafter')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Land Rover
INSERT INTO vehicle_models (brand_id, name) VALUES
(19, 'Freelander'), (19, 'Discovery'), (19, 'Discovery Sport'),
(19, 'Defender'), (19, 'Range Rover'), (19, 'Range Rover Sport'), (19, 'Evoque')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Ford
INSERT INTO vehicle_models (brand_id, name) VALUES
(20, 'Fiesta'), (20, 'Focus'), (20, 'Fusion'),
(20, 'Ranger'), (20, 'F-150'), (20, 'F-250'),
(20, 'Explorer'), (20, 'Escape'), (20, 'Edge'), (20, 'Everest'),
(20, 'Transit'), (20, 'Transit Connect'), (20, 'Mustang')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Jeep
INSERT INTO vehicle_models (brand_id, name) VALUES
(21, 'Wrangler'), (21, 'Grand Cherokee'), (21, 'Cherokee'),
(21, 'Compass'), (21, 'Renegade'), (21, 'Gladiator')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Chevrolet
INSERT INTO vehicle_models (brand_id, name) VALUES
(22, 'Cruze'), (22, 'Captiva'), (22, 'Trailblazer'), (22, 'Blazer'),
(22, 'Colorado'), (22, 'Silverado'), (22, 'Tahoe'), (22, 'Suburban')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Dodge
INSERT INTO vehicle_models (brand_id, name) VALUES
(23, 'Ram 1500'), (23, 'Ram 2500'), (23, 'Ram 3500'),
(23, 'Durango'), (23, 'Charger'), (23, 'Challenger')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Fiat
INSERT INTO vehicle_models (brand_id, name) VALUES
(24, 'Punto'), (24, '500'), (24, 'Tipo'), (24, 'Doblo'),
(24, 'Fiorino'), (24, 'Ducato'), (24, 'Talento')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Iveco
INSERT INTO vehicle_models (brand_id, name) VALUES
(25, 'Daily'), (25, 'Eurocargo'), (25, 'Stralis'), (25, 'Trakker'), (25, 'S-Way')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Chery
INSERT INTO vehicle_models (brand_id, name) VALUES
(26, 'Tiggo 4'), (26, 'Tiggo 7'), (26, 'Tiggo 8'), (26, 'Arrizo 5'), (26, 'Arrizo 6')
ON CONFLICT (brand_id, name) DO NOTHING;

-- JAC
INSERT INTO vehicle_models (brand_id, name) VALUES
(27, 'S3'), (27, 'S7'), (27, 'T6'), (27, 'T8'), (27, 'Refine A60'), (27, 'HFC1061')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Great Wall
INSERT INTO vehicle_models (brand_id, name) VALUES
(28, 'Wingle 5'), (28, 'Wingle 7'), (28, 'Hover H6'), (28, 'Poer'), (28, 'Tank 300')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Geely
INSERT INTO vehicle_models (brand_id, name) VALUES
(29, 'Emgrand EC7'), (29, 'Atlas'), (29, 'Coolray'), (29, 'Tugella')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Haval
INSERT INTO vehicle_models (brand_id, name) VALUES
(30, 'H6'), (30, 'H9'), (30, 'Jolion'), (30, 'Dargo'), (30, 'Big Dog')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Changan
INSERT INTO vehicle_models (brand_id, name) VALUES
(31, 'CS35 Plus'), (31, 'CS55 Plus'), (31, 'CS75 Plus'), (31, 'Hunter'), (31, 'Alsvin')
ON CONFLICT (brand_id, name) DO NOTHING;

-- BYD
INSERT INTO vehicle_models (brand_id, name) VALUES
(32, 'F3'), (32, 'S5'), (32, 'Atto 3'), (32, 'Han'), (32, 'Seagull')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Tata
INSERT INTO vehicle_models (brand_id, name) VALUES
(33, 'Xenon'), (33, 'Safari'), (33, '407'), (33, '709'), (33, 'LPT 1615')
ON CONFLICT (brand_id, name) DO NOTHING;

-- Volvo
INSERT INTO vehicle_models (brand_id, name) VALUES
(34, 'FH'), (34, 'FM'), (34, 'FMX'), (34, 'FE'), (34, 'FL')
ON CONFLICT (brand_id, name) DO NOTHING;

-- MAN
INSERT INTO vehicle_models (brand_id, name) VALUES
(35, 'TGX'), (35, 'TGS'), (35, 'TGM'), (35, 'TGL'), (35, 'TGE')
ON CONFLICT (brand_id, name) DO NOTHING;

-- =====================================================
-- 4. ANNÉES PAR MARQUE
-- Plage d'années selon la présence réelle en Mauritanie
-- =====================================================

-- Japonaises (1990-2026) — très présentes depuis les années 90
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1990, 2026) AS gs(year)
WHERE vm.brand_id IN (1, 2, 3)  -- Toyota, Nissan, Mitsubishi
ON CONFLICT (model_id, year) DO NOTHING;

INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1995, 2026) AS gs(year)
WHERE vm.brand_id IN (4, 5, 6, 7, 8)  -- Honda, Isuzu, Mazda, Suzuki, Hino
ON CONFLICT (model_id, year) DO NOTHING;

-- Coréennes (1995-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1995, 2026) AS gs(year)
WHERE vm.brand_id IN (9, 10)  -- Hyundai, Kia
ON CONFLICT (model_id, year) DO NOTHING;

INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(2000, 2026) AS gs(year)
WHERE vm.brand_id = 11  -- SsangYong
ON CONFLICT (model_id, year) DO NOTHING;

-- Françaises (1995-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1995, 2026) AS gs(year)
WHERE vm.brand_id IN (12, 13, 15)  -- Peugeot, Renault, Citroën
ON CONFLICT (model_id, year) DO NOTHING;

INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(2005, 2026) AS gs(year)
WHERE vm.brand_id = 14  -- Dacia (marque relancée en 2004)
ON CONFLICT (model_id, year) DO NOTHING;

-- Allemandes (1990-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1990, 2026) AS gs(year)
WHERE vm.brand_id IN (16, 17, 18)  -- Mercedes-Benz, BMW, Volkswagen
ON CONFLICT (model_id, year) DO NOTHING;

-- Britanniques (1990-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1990, 2026) AS gs(year)
WHERE vm.brand_id = 19  -- Land Rover
ON CONFLICT (model_id, year) DO NOTHING;

-- Américaines (1990-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1990, 2026) AS gs(year)
WHERE vm.brand_id IN (20, 21, 22, 23)  -- Ford, Jeep, Chevrolet, Dodge
ON CONFLICT (model_id, year) DO NOTHING;

-- Italiennes (1995-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1995, 2026) AS gs(year)
WHERE vm.brand_id IN (24, 25)  -- Fiat, Iveco
ON CONFLICT (model_id, year) DO NOTHING;

-- Chinoises — arrivées progressivement
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(2010, 2026) AS gs(year)
WHERE vm.brand_id IN (26, 27, 28)  -- Chery, JAC, Great Wall
ON CONFLICT (model_id, year) DO NOTHING;

INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(2012, 2026) AS gs(year)
WHERE vm.brand_id IN (29, 30, 31)  -- Geely, Haval, Changan
ON CONFLICT (model_id, year) DO NOTHING;

INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(2015, 2026) AS gs(year)
WHERE vm.brand_id = 32  -- BYD
ON CONFLICT (model_id, year) DO NOTHING;

-- Indiennes (2000-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(2000, 2026) AS gs(year)
WHERE vm.brand_id = 33  -- Tata
ON CONFLICT (model_id, year) DO NOTHING;

-- Poids lourds européens (1990-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT vm.id, gs.year
FROM vehicle_models vm
CROSS JOIN generate_series(1990, 2026) AS gs(year)
WHERE vm.brand_id IN (34, 35)  -- Volvo, MAN
ON CONFLICT (model_id, year) DO NOTHING;

-- =====================================================
-- 8. COMPTE ADMIN PAR DÉFAUT
-- =====================================================

-- Mot de passe: AutolinkAdmin2026!
INSERT INTO users (id, phone, email, password_hash, role, status, first_name, last_name, phone_verified_at) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    '+22220000000',
    'admin@autolink.mr',
    '$2b$10$yFJQrJ5lqXGJ5WqYqL9QQe.KxGnLZ6CxJHxJQKqJ5lqXGJ5WqYqL9', -- AutolinkAdmin2026!
    'admin',
    'active',
    'Admin',
    'Autolink',
    NOW()
);

-- =====================================================
-- 9. BOUTIQUES DE DÉMONSTRATION
-- =====================================================

-- Utilisateur pour Boutique Demo 1
INSERT INTO users (id, phone, email, password_hash, role, status, first_name, last_name, phone_verified_at) VALUES
(
    '00000000-0000-0000-0000-000000000002',
    '+22222123456',
    'boutique1@autolink.mr',
    '$2b$10$yFJQrJ5lqXGJ5WqYqL9QQe.KxGnLZ6CxJHxJQKqJ5lqXGJ5WqYqL9', -- Boutique2026!
    'boutique',
    'active',
    'Ahmed',
    'Mohamed',
    NOW()
);

-- Boutique Demo 1 - Tevragh Zeina
INSERT INTO boutiques (
    id,
    user_id,
    commercial_name,
    address,
    quartier,
    latitude,
    longitude,
    phone,
    whatsapp_number,
    description,
    status,
    verified_at,
    verified_by
) VALUES (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000002',
    'Pièces Auto Ahmed',
    'Route de l''Ambassade de France',
    'Tevragh Zeina',
    18.0893,
    -15.9785,
    '+22222123456',
    '+22222123456',
    'Spécialiste pièces Toyota et Nissan. Neuves et d''occasion. Service rapide.',
    'verified',
    NOW(),
    '00000000-0000-0000-0000-000000000001'
);

-- Utilisateur pour Boutique Demo 2
INSERT INTO users (id, phone, email, password_hash, role, status, first_name, last_name, phone_verified_at) VALUES
(
    '00000000-0000-0000-0000-000000000003',
    '+22222234567',
    'boutique2@autolink.mr',
    '$2b$10$yFJQrJ5lqXGJ5WqYqL9QQe.KxGnLZ6CxJHxJQKqJ5lqXGJ5WqYqL9',
    'boutique',
    'active',
    'Cheikh',
    'Ould Ahmed',
    NOW()
);

-- Boutique Demo 2 - Capitale
INSERT INTO boutiques (
    id,
    user_id,
    commercial_name,
    address,
    quartier,
    latitude,
    longitude,
    phone,
    whatsapp_number,
    description,
    status,
    verified_at,
    verified_by
) VALUES (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000003',
    'Auto Pièces Capitale',
    'Avenue Gamal Abdel Nasser',
    'Capitale',
    18.0735,
    -15.9582,
    '+22222234567',
    '+22222234567',
    'Toutes marques. Pièces neuves garanties. Prix compétitifs.',
    'verified',
    NOW(),
    '00000000-0000-0000-0000-000000000001'
);

-- =====================================================
-- 10. PRODUITS DE DÉMONSTRATION
-- =====================================================

-- Produit 1: Alternateur Toyota Hilux
INSERT INTO products (
    id,
    boutique_id,
    category_id,
    name,
    description,
    condition,
    status,
    price,
    stock_quantity,
    oem_reference,
    warranty_months,
    published_at
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    (SELECT id FROM categories WHERE slug = 'alternateur'),
    'Alternateur Toyota Hilux 2.5L Diesel',
    'Alternateur d''origine compatible Toyota Hilux 2.5L diesel. État neuf, garantie 12 mois. Ampérage: 80A.',
    'neuf',
    'active',
    45000.00,
    5,
    '27060-0L070',
    12,
    NOW()
);

-- Compatibilité Hilux 2015-2020
INSERT INTO product_compatibilities (product_id, vehicle_year_id)
SELECT 
    '10000000-0000-0000-0000-000000000001',
    vy.id
FROM vehicle_years vy
JOIN vehicle_models vm ON vy.model_id = vm.id
WHERE vm.name = 'Hilux' AND vy.year BETWEEN 2015 AND 2020;

-- Image produit 1
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
('10000000-0000-0000-0000-000000000001', 'https://placehold.co/600x400/png?text=Alternateur+Toyota', 0, TRUE);

-- Produit 2: Plaquettes de frein Corolla
INSERT INTO products (
    id,
    boutique_id,
    category_id,
    name,
    description,
    condition,
    status,
    price,
    stock_quantity,
    warranty_months,
    published_at
) VALUES (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000102',
    (SELECT id FROM categories WHERE slug = 'plaquettes-frein'),
    'Plaquettes de frein avant Toyota Corolla',
    'Jeu de 4 plaquettes de frein avant pour Toyota Corolla. Marque premium, excellente performance de freinage.',
    'neuf',
    'active',
    12000.00,
    15,
    6,
    NOW()
);

-- Compatibilité Corolla 2010-2018
INSERT INTO product_compatibilities (product_id, vehicle_year_id)
SELECT 
    '10000000-0000-0000-0000-000000000002',
    vy.id
FROM vehicle_years vy
JOIN vehicle_models vm ON vy.model_id = vm.id
WHERE vm.name = 'Corolla' AND vy.year BETWEEN 2010 AND 2018;

-- Image produit 2
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
('10000000-0000-0000-0000-000000000002', 'https://placehold.co/600x400/png?text=Plaquettes+Frein', 0, TRUE);

-- Produit 3: Phare avant Nissan Patrol (Occasion)
INSERT INTO products (
    id,
    boutique_id,
    category_id,
    name,
    description,
    condition,
    status,
    price,
    original_price,
    stock_quantity,
    published_at
) VALUES (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000101',
    (SELECT id FROM categories WHERE slug = 'phares-avant'),
    'Phare avant gauche Nissan Patrol',
    'Phare avant gauche d''occasion en bon état. Testé fonctionnel. Idéal pour remplacement économique.',
    'occasion',
    'active',
    35000.00,
    65000.00,
    2,
    NOW()
);

-- Compatibilité Patrol 2014-2019
INSERT INTO product_compatibilities (product_id, vehicle_year_id, notes)
SELECT 
    '10000000-0000-0000-0000-000000000003',
    vy.id,
    'Compatible modèles sans LED'
FROM vehicle_years vy
JOIN vehicle_models vm ON vy.model_id = vm.id
JOIN vehicle_brands vb ON vm.brand_id = vb.id
WHERE vb.name = 'Nissan' AND vm.name = 'Patrol' AND vy.year BETWEEN 2014 AND 2019;

-- Image produit 3
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
('10000000-0000-0000-0000-000000000003', 'https://placehold.co/600x400/png?text=Phare+Nissan', 0, TRUE);

-- =====================================================
-- 11. CLIENT DE DÉMONSTRATION
-- =====================================================

INSERT INTO users (id, phone, email, password_hash, role, status, first_name, last_name, phone_verified_at) VALUES
(
    '00000000-0000-0000-0000-000000000004',
    '+22222345678',
    'client@example.mr',
    '$2b$10$yFJQrJ5lqXGJ5WqYqL9QQe.KxGnLZ6CxJHxJQKqJ5lqXGJ5WqYqL9', -- Client2026!
    'client',
    'active',
    'Sidi',
    'Mohamed',
    NOW()
);

-- =====================================================
-- 12. RAFRAÎCHIR LA VUE MATÉRIALISÉE
-- =====================================================

REFRESH MATERIALIZED VIEW boutique_ratings;

-- =====================================================
-- SEED TERMINÉ
-- =====================================================

SELECT 'Seed data inserted successfully!' AS status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_boutiques FROM boutiques;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_vehicle_brands FROM vehicle_brands;
SELECT COUNT(*) as total_categories FROM categories;
