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
-- 2. MARQUES DE VÉHICULES (POPULAIRES EN MAURITANIE)
-- =====================================================

INSERT INTO vehicle_brands (id, name, display_order) VALUES
(1, 'Toyota', 1),
(2, 'Nissan', 2),
(3, 'Peugeot', 3),
(4, 'Renault', 4),
(5, 'Hyundai', 5),
(6, 'Kia', 6),
(7, 'Mitsubishi', 7),
(8, 'Ford', 8),
(9, 'Volkswagen', 9),
(10, 'Mercedes-Benz', 10),
(11, 'Land Rover', 11),
(12, 'Isuzu', 12),
(13, 'Dacia', 13),
(14, 'Suzuki', 14),
(15, 'Honda', 15);

-- =====================================================
-- 3. MODÈLES TOYOTA (TRÈS POPULAIRE EN MAURITANIE)
-- =====================================================

INSERT INTO vehicle_models (brand_id, name) VALUES
(1, 'Hilux'),
(1, 'Land Cruiser'),
(1, 'Corolla'),
(1, 'Yaris'),
(1, 'Camry'),
(1, 'RAV4'),
(1, 'Prado'),
(1, 'Avensis');

-- Années pour Hilux (2010-2026)
INSERT INTO vehicle_years (model_id, year)
SELECT 1, generate_series FROM generate_series(2010, 2026);

-- Années pour Land Cruiser
INSERT INTO vehicle_years (model_id, year)
SELECT 2, generate_series FROM generate_series(2010, 2026);

-- Années pour Corolla
INSERT INTO vehicle_years (model_id, year)
SELECT 3, generate_series FROM generate_series(2010, 2026);

-- =====================================================
-- 4. MODÈLES NISSAN
-- =====================================================

INSERT INTO vehicle_models (brand_id, name) VALUES
(2, 'Patrol'),
(2, 'Navara'),
(2, 'Qashqai'),
(2, 'X-Trail'),
(2, 'Micra'),
(2, 'Juke');

-- Années Patrol
INSERT INTO vehicle_years (model_id, year)
SELECT 9, generate_series FROM generate_series(2010, 2026);

-- Années Navara
INSERT INTO vehicle_years (model_id, year)
SELECT 10, generate_series FROM generate_series(2010, 2026);

-- =====================================================
-- 5. MODÈLES PEUGEOT
-- =====================================================

INSERT INTO vehicle_models (brand_id, name) VALUES
(3, '308'),
(3, '208'),
(3, '2008'),
(3, '3008'),
(3, '5008'),
(3, '508'),
(3, 'Partner');

-- =====================================================
-- 6. MODÈLES RENAULT
-- =====================================================

INSERT INTO vehicle_models (brand_id, name) VALUES
(4, 'Clio'),
(4, 'Megane'),
(4, 'Kadjar'),
(4, 'Captur'),
(4, 'Duster'),
(4, 'Logan'),
(4, 'Sandero');

-- =====================================================
-- 7. MODÈLES DACIA (POPULAIRE ET ABORDABLE)
-- =====================================================

INSERT INTO vehicle_models (brand_id, name) VALUES
(13, 'Duster'),
(13, 'Logan'),
(13, 'Sandero'),
(13, 'Lodgy');

-- Années Dacia Duster
INSERT INTO vehicle_years (model_id, year)
SELECT 
    (SELECT id FROM vehicle_models WHERE brand_id = 13 AND name = 'Duster'),
    generate_series 
FROM generate_series(2010, 2026);

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
