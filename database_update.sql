-- ═══════════════════════════════════════════════════════════════
-- MEBLI-PRO DATABASE MASSIVE UPDATE
-- Виконайте цей файл в Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Оновити кеш схеми (важливо для analytics path)
NOTIFY pgrst, 'reload schema';

-- 2. Перевірити та додати колонку path в site_events (якщо немає)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_events' AND column_name = 'path') THEN
        ALTER TABLE site_events ADD COLUMN path TEXT;
    END IF;
END $$;

-- 3. Оновити таблицю blog додавши SEO поля
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog' AND column_name = 'meta_title') THEN
        ALTER TABLE blog ADD COLUMN meta_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog' AND column_name = 'meta_description') THEN
        ALTER TABLE blog ADD COLUMN meta_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog' AND column_name = 'tags') THEN
        ALTER TABLE blog ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog' AND column_name = 'alt_text') THEN
        ALTER TABLE blog ADD COLUMN alt_text TEXT;
    END IF;
END $$;

-- 4. Оновити таблицю reviews додавши модерацію та Google Auth
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reviews' AND column_name = 'is_published') THEN
        ALTER TABLE reviews ADD COLUMN is_published BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reviews' AND column_name = 'google_id') THEN
        ALTER TABLE reviews ADD COLUMN google_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reviews' AND column_name = 'avatar_url') THEN
        ALTER TABLE reviews ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- 5. Оновити таблицю gallery додавши alt_text
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gallery' AND column_name = 'alt_text') THEN
        ALTER TABLE gallery ADD COLUMN alt_text TEXT;
    END IF;
END $$;

-- 6. Оновити site_settings для 9 послуг
-- Спочатку перевіримо чи є запис з ключем 'site'
UPDATE site_settings 
SET value = jsonb_build_object(
    'title', 'Mebli-PRO — Меблі на замовлення в Києві (Лівий берег)',
    'phone', '+380 93 143 18 43',
    'telegram', '@devcraft_ua',
    'workHours', 'Пн-Сб: 9:00 - 20:00',
    'services', jsonb_build_array(
        jsonb_build_object('id', '1', 'title', 'Кухонні Меблі', 'desc', 'Індивідуальні кухонні гарнітури, острови та високі шафи з системами зберігання. Преміум фурнітура Blum та Hettich.', 'bg', '/images/kitchen_modern.png', 'slug', 'kukhni', 'category', 'kitchen'),
        jsonb_build_object('id', '2', 'title', 'Шафи та Гардеробні', 'desc', 'Шафи-купе, гардеробні, пенали та платтяні кімнати з максимальним використанням простору.', 'bg', '/images/wardrobe_builtin.png', 'slug', 'shafi', 'category', 'wardrobe'),
        jsonb_build_object('id', '3', 'title', 'Ліжка-Трансформери', 'desc', 'Система 3-в-1: ліжко + шафа + диван. Ідеальне рішення для маленьких квартир та студій.', 'bg', '/images/transformer1.jpg', 'slug', 'lizhka-transformery', 'category', 'bed'),
        jsonb_build_object('id', '4', 'title', 'Підвісні Столи', 'desc', 'Компактні столи-трансформери, що складаються в полицю. Економія простору на кухні та в офісі.', 'bg', '/images/471500883.webp', 'slug', 'pidvisni-stoly', 'category', 'tables'),
        jsonb_build_object('id', '5', 'title', 'Дитячі Кімнати', 'desc', 'Комплексні рішення під ключ: ліжка-горища, робочі зони, ігрові майданчики з безпечних матеріалів.', 'bg', '/images/children_room.png', 'slug', 'dityachi-kimnaty', 'category', 'children'),
        jsonb_build_object('id', '6', 'title', 'Офісні Приміщення', 'desc', 'Офісні меблі преміум-класу: столи, шафи для документів, ресепшени, системи зберігання.', 'bg', '/images/office_desk.png', 'slug', 'ofisni-mebli', 'category', 'office'),
        jsonb_build_object('id', '7', 'title', 'Вироби зі Скла', 'desc', 'Скляні полиці, дзеркала, душові кабіни, міжкімнатні перегородки. Індивідуальні розміри.', 'bg', '/images/luxury_kitchen.png', 'slug', 'vyroby-zi-skla', 'category', 'glass'),
        jsonb_build_object('id', '8', 'title', 'Стільниці', 'desc', 'Кухонні та офісні стільниці з кварцу, акрилу, масиву дерева. Будь-які розміри та форми.', 'bg', '/images/kitchen_island.png', 'slug', 'stilnytsi', 'category', 'countertops'),
        jsonb_build_object('id', '9', 'title', 'Розсувні Системи', 'desc', 'Розсувні двері купе, перегородки, фасадні системи. Преміум механізми з доводчиками.', 'bg', '/images/closet_white.png', 'slug', 'rozsuvni-systemy', 'category', 'sliding')
    )
)
WHERE key = 'site';

-- Якщо запису немає — створимо
INSERT INTO site_settings (key, value)
SELECT 'site', jsonb_build_object(
    'title', 'Mebli-PRO — Меблі на замовлення в Києві (Лівий берег)',
    'phone', '+380 93 143 18 43',
    'telegram', '@devcraft_ua',
    'workHours', 'Пн-Сб: 9:00 - 20:00',
    'services', jsonb_build_array(
        jsonb_build_object('id', '1', 'title', 'Кухонні Меблі', 'desc', 'Індивідуальні кухонні гарнітури, острови та високі шафи з системами зберігання. Преміум фурнітура Blum та Hettich.', 'bg', '/images/kitchen_modern.png', 'slug', 'kukhni', 'category', 'kitchen'),
        jsonb_build_object('id', '2', 'title', 'Шафи та Гардеробні', 'desc', 'Шафи-купе, гардеробні, пенали та платтяні кімнати з максимальним використанням простору.', 'bg', '/images/wardrobe_builtin.png', 'slug', 'shafi', 'category', 'wardrobe'),
        jsonb_build_object('id', '3', 'title', 'Ліжка-Трансформери', 'desc', 'Система 3-в-1: ліжко + шафа + диван. Ідеальне рішення для маленьких квартир та студій.', 'bg', '/images/transformer1.jpg', 'slug', 'lizhka-transformery', 'category', 'bed'),
        jsonb_build_object('id', '4', 'title', 'Підвісні Столи', 'desc', 'Компактні столи-трансформери, що складаються в полицю. Економія простору на кухні та в офісі.', 'bg', '/images/471500883.webp', 'slug', 'pidvisni-stoly', 'category', 'tables'),
        jsonb_build_object('id', '5', 'title', 'Дитячі Кімнати', 'desc', 'Комплексні рішення під ключ: ліжка-горища, робочі зони, ігрові майданчики з безпечних матеріалів.', 'bg', '/images/children_room.png', 'slug', 'dityachi-kimnaty', 'category', 'children'),
        jsonb_build_object('id', '6', 'title', 'Офісні Приміщення', 'desc', 'Офісні меблі преміум-класу: столи, шафи для документів, ресепшени, системи зберігання.', 'bg', '/images/office_desk.png', 'slug', 'ofisni-mebli', 'category', 'office'),
        jsonb_build_object('id', '7', 'title', 'Вироби зі Скла', 'desc', 'Скляні полиці, дзеркала, душові кабіни, міжкімнатні перегородки. Індивідуальні розміри.', 'bg', '/images/luxury_kitchen.png', 'slug', 'vyroby-zi-skla', 'category', 'glass'),
        jsonb_build_object('id', '8', 'title', 'Стільниці', 'desc', 'Кухонні та офісні стільниці з кварцу, акрилу, масиву дерева. Будь-які розміри та форми.', 'bg', '/images/kitchen_island.png', 'slug', 'stilnytsi', 'category', 'countertops'),
        jsonb_build_object('id', '9', 'title', 'Розсувні Системи', 'desc', 'Розсувні двері купе, перегородки, фасадні системи. Преміум механізми з доводчиками.', 'bg', '/images/closet_white.png', 'slug', 'rozsuvni-systemy', 'category', 'sliding')
    )
)
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'site');

-- 7. Оновити кеш схеми ще раз
NOTIFY pgrst, 'reload schema';

-- ═══════════════════════════════════════════════════════════════
-- ГОТОВО! Всі оновлення виконано.
-- Тепер в адмінці має відображатися 9 послуг
-- Та працювати analytics з колонкою path
-- ═══════════════════════════════════════════════════════════════
