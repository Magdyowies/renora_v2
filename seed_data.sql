BEGIN;

-- =========================
-- USERS
-- =========================
INSERT INTO users (
    password,
    is_superuser,
    username,
    first_name,
    last_name,
    email,
    is_staff,
    is_active,
    date_joined,
    role,
    phone,
    created_at,
    updated_at
)
VALUES
('DEMO_PASSWORD', TRUE,  'admin',    'Admin',    'User', 'admin@example.com',    TRUE,  TRUE, NOW(), 'admin',    '1234567890', NOW(), NOW()),
('DEMO_PASSWORD', FALSE, 'vendor',   'Vendor',   'User', 'vendor@example.com',   FALSE, TRUE, NOW(), 'vendor',   '0987654321', NOW(), NOW()),
('DEMO_PASSWORD', FALSE, 'customer', 'Customer', 'User', 'customer@example.com', FALSE, TRUE, NOW(), 'customer', '1122334455', NOW(), NOW())
ON CONFLICT  DO NOTHING;

-- =========================
-- USER PROFILES
-- =========================
INSERT INTO user_profiles (
    user_id,
    avatar,
    address,
    city,
    country,
    driver_license,
    driver_license_expiry,
    created_at,
    updated_at
)
SELECT
    u.id,
    'avatars/default.jpg',
    'Demo Address',
    'Cairo',
    'Egypt',
    CONCAT('DL-', u.id),
    NOW() + INTERVAL '5 years',
    NOW(),
    NOW()
FROM users u
ON CONFLICT  DO NOTHING;

-- =========================
-- VEHICLE CATEGORIES
-- =========================
INSERT INTO vehicle_categories (name, description, icon, created_at)
VALUES
('Sedan', 'Standard passenger car', 'sedan.svg', NOW()),
('SUV',   'Sport Utility Vehicle',  'suv.svg',   NOW())
ON CONFLICT  DO NOTHING;

-- =========================
-- VEHICLES
-- =========================
INSERT INTO vehicles (
    name,
    brand,
    model,
    year,
    seats,
    doors,
    transmission,
    fuel_type,
    price_per_day,
    location,
    description,
    features,
    status,
    rating,
    total_reviews,
    vendor_id,
    category_id,
    created_at,
    updated_at
)
SELECT
    'Toyota Camry',
    'Toyota',
    'Camry',
    2023,
    5,
    4,
    'Automatic',
    'Gasoline',
    80.00,
    'Cairo',
    'Reliable sedan',
    '{"gps": true, "bluetooth": true}'::jsonb,
    'available',
    4.7,
    10,
    u.id,
    c.id,
    NOW(),
    NOW()
FROM users u
JOIN vehicle_categories c ON c.name = 'Sedan'
WHERE u.role = 'vendor'
LIMIT 1;

-- =========================
-- VEHICLE IMAGES
-- =========================
INSERT INTO vehicle_images (vehicle_id, image, is_primary, created_at)
SELECT
    v.id,
    'images/car_main.jpg',
    TRUE,
    NOW()
FROM vehicles v
LIMIT 1;

-- =========================
-- WALLETS
-- =========================
INSERT INTO wallets (user_id, balance, created_at, updated_at)
SELECT id, 500.00, NOW(), NOW()
FROM users
ON CONFLICT DO NOTHING;

-- =========================
-- PROMO CODES
-- =========================
INSERT INTO promo_codes (
    code,
    discount_type,
    discount_value,
    min_booking_amount,
    max_discount,
    usage_limit,
    used_count,
    valid_from,
    valid_until,
    is_active,
    created_at
)
VALUES
('WINTER2025', 'percentage', 15, 100, 50, 200, 0, NOW(), NOW() + INTERVAL '3 months', TRUE, NOW())
ON CONFLICT DO NOTHING;

-- =========================
-- BOOKINGS
-- =========================
INSERT INTO bookings (
    customer_id,
    vehicle_id,
    pickup_date,
    return_date,
    pickup_location,
    return_location,
    total_days,
    base_price,
    discount_amount,
    total_price,
    status,
    notes,
    created_at,
    updated_at
)
SELECT
    c.id,
    v.id,
    NOW(),
    NOW() + INTERVAL '3 days',
    'Cairo Airport',
    'Cairo Airport',
    3,
    240,
    0,
    240,
    'confirmed',
    'Demo booking created by seed script',
    NOW(),
    NOW()
FROM users c
JOIN vehicles v ON TRUE
WHERE c.role = 'customer'
LIMIT 1;

-- =========================
-- PAYMENTS
-- =========================
INSERT INTO payments (
    booking_id,
    user_id,
    amount,
    method,
    status,
    transaction_id,
    payment_details,
    created_at,
    updated_at
)
SELECT
    b.id,
    b.customer_id,
    b.total_price,
    'card',
    'completed',
    CONCAT('txn_', b.id, '_seed'),
    '{"provider":"visa","last4":"4242"}'::jsonb,
    NOW(),
    NOW()
FROM bookings b
LIMIT 1;

-- =========================
-- REVIEWS
-- =========================
INSERT INTO reviews (
    booking_id,
    user_id,
    vehicle_id,
    rating,
    comment,
    created_at,
    updated_at
)
SELECT
    b.id,
    b.customer_id,
    b.vehicle_id,
    5,
    'Great experience',
    NOW(),
    NOW()
FROM bookings b
LIMIT 1;

-- =========================
-- CHAT
-- =========================
INSERT INTO chat_sessions (user_id, status, created_at, updated_at)
SELECT id, 'open', NOW(), NOW()
FROM users
WHERE role = 'customer'
LIMIT 1;

INSERT INTO chat_messages (session_id, sender_type, content, created_at)
SELECT id, 'customer', 'Hello, I have a question', NOW()
FROM chat_sessions
LIMIT 1;

-- =========================
-- ADMIN REPORTS
-- =========================
INSERT INTO admin_reports (
    admin_id,
    report_type,
    title,
    data,
    date_from,
    date_to,
    created_at
)
SELECT
    id,
    'system',
    'Demo Report',
    '{"demo": true}'::jsonb,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE,
    NOW()
FROM users
WHERE role = 'admin'
LIMIT 1;

COMMIT;
