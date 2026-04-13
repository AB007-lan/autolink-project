-- =====================================================
-- AUTOLINK DATABASE INITIALIZATION
-- Version: 1.0
-- Date: 11 Avril 2026
-- =====================================================

-- Extensions PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TYPES ÉNUMÉRÉS
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'boutique', 'client');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'banned');
CREATE TYPE boutique_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
CREATE TYPE product_condition AS ENUM ('neuf', 'occasion', 'reconditionne');
CREATE TYPE product_status AS ENUM ('draft', 'pending', 'active', 'rejected', 'sold_out');
CREATE TYPE order_status AS ENUM (
    'pending_confirmation',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'in_delivery',
    'delivered',
    'cancelled',
    'refunded'
);
CREATE TYPE payment_method AS ENUM ('bankily', 'masrvi', 'sedad', 'cash_on_delivery');
CREATE TYPE delivery_method AS ENUM ('pickup', 'delivery');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM (
    'order_confirmed',
    'order_delivered',
    'new_message',
    'boutique_verified',
    'low_stock',
    'new_review'
);

-- =====================================================
-- TABLE USERS
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    status user_status NOT NULL DEFAULT 'pending',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- TABLE OTP_CODES
-- =====================================================

CREATE TABLE otp_codes (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_otp_phone_code ON otp_codes(phone, code) WHERE used_at IS NULL;

-- =====================================================
-- TABLE BOUTIQUES
-- =====================================================

CREATE TABLE boutiques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    commercial_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    address TEXT NOT NULL,
    quartier VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    status boutique_status NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_boutiques_user ON boutiques(user_id);
CREATE INDEX idx_boutiques_status ON boutiques(status);
CREATE INDEX idx_boutiques_quartier ON boutiques(quartier);

-- =====================================================
-- TABLE BOUTIQUE_DOCUMENTS
-- =====================================================

CREATE TABLE boutique_documents (
    id SERIAL PRIMARY KEY,
    boutique_id UUID NOT NULL REFERENCES boutiques(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE VEHICLE_BRANDS
-- =====================================================

CREATE TABLE vehicle_brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_brands_order ON vehicle_brands(display_order);

-- =====================================================
-- TABLE VEHICLE_MODELS
-- =====================================================

CREATE TABLE vehicle_models (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL REFERENCES vehicle_brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    UNIQUE(brand_id, name)
);

CREATE INDEX idx_models_brand ON vehicle_models(brand_id);

-- =====================================================
-- TABLE VEHICLE_YEARS
-- =====================================================

CREATE TABLE vehicle_years (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 1980 AND year <= 2030),
    UNIQUE(model_id, year)
);

CREATE INDEX idx_years_model ON vehicle_years(model_id);

-- =====================================================
-- TABLE CATEGORIES
-- =====================================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- =====================================================
-- TABLE PRODUCTS
-- =====================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boutique_id UUID NOT NULL REFERENCES boutiques(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    condition product_condition NOT NULL,
    status product_status NOT NULL DEFAULT 'pending',
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    oem_reference VARCHAR(100),
    sku VARCHAR(100),
    weight_kg DECIMAL(6, 2),
    warranty_months INTEGER,
    views_count INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_products_boutique ON products(boutique_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_condition ON products(condition);

-- =====================================================
-- TABLE PRODUCT_IMAGES
-- =====================================================

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =====================================================
-- TABLE PRODUCT_COMPATIBILITIES
-- =====================================================

CREATE TABLE product_compatibilities (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    vehicle_year_id INTEGER NOT NULL REFERENCES vehicle_years(id),
    notes TEXT,
    UNIQUE(product_id, vehicle_year_id)
);

CREATE INDEX idx_compatibility_product ON product_compatibilities(product_id);
CREATE INDEX idx_compatibility_vehicle ON product_compatibilities(vehicle_year_id);

-- =====================================================
-- TABLE ORDERS
-- =====================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES users(id),
    boutique_id UUID NOT NULL REFERENCES boutiques(id),
    status order_status NOT NULL DEFAULT 'pending_confirmation',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2),
    payment_method payment_method NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    delivery_method delivery_method NOT NULL,
    delivery_address TEXT,
    delivery_quartier VARCHAR(100),
    delivery_phone VARCHAR(20),
    delivery_notes TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE SEQUENCE order_number_seq;
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_boutique ON orders(boutique_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =====================================================
-- TABLE ORDER_ITEMS
-- =====================================================

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_condition product_condition NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================
-- TABLE TRANSACTIONS
-- =====================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    provider payment_method NOT NULL,
    provider_transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MRU',
    status transaction_status NOT NULL DEFAULT 'pending',
    provider_response JSONB,
    webhook_received_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_transactions_provider_id ON transactions(provider_transaction_id);

-- =====================================================
-- TABLE CONVERSATIONS
-- =====================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id),
    boutique_id UUID NOT NULL REFERENCES boutiques(id),
    product_id UUID REFERENCES products(id),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, boutique_id, product_id)
);

CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_boutique ON conversations(boutique_id);

-- =====================================================
-- TABLE MESSAGES
-- =====================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- =====================================================
-- TABLE REVIEWS
-- =====================================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    boutique_id UUID NOT NULL REFERENCES boutiques(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_id)
);

CREATE INDEX idx_reviews_boutique ON reviews(boutique_id);

-- =====================================================
-- TABLE FAVORITES
-- =====================================================

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- =====================================================
-- TABLE NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- =====================================================
-- TABLE AUDIT_LOGS
-- =====================================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- =====================================================
-- VUE MATÉRIALISÉE : BOUTIQUE RATINGS
-- =====================================================

CREATE MATERIALIZED VIEW boutique_ratings AS
SELECT 
    boutique_id,
    COUNT(*) as review_count,
    AVG(rating) as average_rating
FROM reviews
WHERE is_approved = TRUE
GROUP BY boutique_id;

CREATE UNIQUE INDEX idx_boutique_ratings ON boutique_ratings(boutique_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Fonction: Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boutiques_updated_at BEFORE UPDATE ON boutiques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction: Génération automatique du numéro de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'AUTO-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                        LPAD(nextval('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Fonction: Mise à jour du stock après commande
CREATE OR REPLACE FUNCTION update_product_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrease_stock_on_order AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_product_stock_on_order();

-- =====================================================
-- PERMISSIONS
-- =====================================================

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO autolink_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO autolink_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO autolink_user;

-- =====================================================
-- INITIALISATION TERMINÉE
-- =====================================================

SELECT 'Database Autolink initialized successfully!' AS status;
