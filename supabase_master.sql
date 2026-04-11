-- ═══════════════════════════════════════════════════════════════
-- MEBLI-PRO — Supabase Master SQL (SINGLE SOURCE OF TRUTH)
-- ═══════════════════════════════════════════════════════════════
-- Скопіюйте ВЕСЬ КОД → SQL Editor (Supabase) → RUN
-- Цей файл можна запускати повторно — він безпечний (idempotent).
-- ═══════════════════════════════════════════════════════════════

-- ─── ТАБЛИЦІ ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS gallery (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category    TEXT,
  title       TEXT NOT NULL,
  materials   TEXT,
  image_urls  TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  -- Case study fields
  budget      TEXT,
  area_sqm    NUMERIC,
  task        TEXT,
  solution    TEXT,
  before_images TEXT[]
);

CREATE TABLE IF NOT EXISTS reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name  TEXT NOT NULL,
  text_content TEXT NOT NULL,
  rating       INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  is_approved  BOOLEAN DEFAULT false,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name     TEXT,
  client_contact  TEXT,
  project_topic   TEXT,
  budget_range    TEXT,
  notes           TEXT,
  files_url       TEXT[],
  status          TEXT DEFAULT 'new',
  details         JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT NOT NULL,
  image_url    TEXT,
  layout_style TEXT DEFAULT 'standard',
  category     TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- site_events: NO 'detail' column — code must never insert 'detail'
CREATE TABLE IF NOT EXISTS site_events (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  path       TEXT,
  referrer   TEXT,
  source     TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- site_settings: key-value store. Keys used: 'site', 'banner'
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ─── ДАНІ ЗА ЗАМОВЧУВАННЯМ ───────────────────────────────────

INSERT INTO site_settings (key, value)
VALUES (
  'banner',
  '{
    "is_active": false,
    "template": "text",
    "title": "Спеціальна пропозиція",
    "text": "Безкоштовний виїзд на замір до кінця місяця!",
    "button_text": "Скористатися пропозицією",
    "image_url": "",
    "image_position": "right"
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

INSERT INTO site_settings (key, value)
VALUES (
  'site',
  '{
    "phone": "+380 93 143 1843",
    "email": "meblipro2025@gmail.com",
    "telegram": "https://t.me/mebli_pro_admin",
    "viber": "viber://add?number=380931431843",
    "whatsapp": "https://wa.me/380931431843",
    "instagram": "",
    "logo_text": "MEBLI-PRO",
    "logo_subtitle": "МАЙСТЕРНЯ МЕБЛІВ",
    "show_logo_graphic": true,
    "hero_title": "Меблі Преміум-Класу",
    "hero_subtitle": "Кухні, шафи та гардеробні за індивідуальним проектом на Лівому березі Києва",
    "about": [
      "Мене звати Олександр, і я виготовляю меблі на замовлення у Києві, зокрема на Лівому березі, Троєщині, Лісовому масиві, Дарниці та Биківні.",
      "Працюю без посередників, тому контролюю кожен етап — від замірів до монтажу. Результат: функціональні меблі для сучасного інтер''єру."
    ],
    "services": [
      { "title": "Кухонні Меблі", "desc": "Індивідуальні кухонні гарнітури, острови та високі шафи з системами зберігання.", "bg": "/images/kitchen_modern.png" },
      { "title": "Шафи та Гардеробні", "desc": "Шафи-купе, гардеробні, пенали та платтяні кімнати з максимальним використанням простору.", "bg": "/images/wardrobe_builtin.png" },
      { "title": "Передпокої та Вітальня", "desc": "Комплексні рішення для передпокою, ТВ-зон та зон відпочинку.", "bg": "/images/living_room_tv.png" },
      { "title": "Реставрація та Ремонт", "desc": "Відновлення фасадів, заміна фурнітури та сучасні ремонтні рішення.", "bg": "/images/office_desk.png" },
      { "title": "Дитячі та Офісні Зони", "desc": "Зручні майданчики для навчання, роботи та зберігання речей.", "bg": "/images/children_room.png" }
    ],
    "benefits": [
      { "title": "Офіційний ФОП", "desc": "Працюю за договором. Жодних прихованих ризиків." },
      { "title": "Власне виробництво", "desc": "Повний контроль якості та реальні терміни." },
      { "title": "Преміум матеріали", "desc": "Використовую лише перевірені бренди (Egger, Blum)." },
      { "title": "Реставрація", "desc": "Друге життя для ваших улюблених фасадів." }
    ],
    "highlights": [
      { "title": "Повний цикл виробництва", "subtitle": "Від проєкту до монтажу з контролем якості." },
      { "title": "Гарантія на роботу", "subtitle": "До 5 років сервісної підтримки." }
    ],
    "faq": [
      { "question": "Які терміни виготовлення меблів?", "answer": "Від 14 до 45 днів залежно від складності." },
      { "question": "Чи є ви офіційним ФОП?", "answer": "Так, працюю як ФОП і надаю договір з гарантіями." },
      { "question": "Чи виїзд на замір безкоштовний?", "answer": "Так, по Києву виїзд безкоштовний при замовленні." }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- ─── МІГРАЦІЯ НАЯВНИХ ТАБЛИЦЬ (якщо вже існують зі старою схемою) ───
-- Безпечно — IF NOT EXISTS не падає якщо колонка вже є

ALTER TABLE gallery ADD COLUMN IF NOT EXISTS category    TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_urls  TEXT[];
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS materials   TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS budget      TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS area_sqm    NUMERIC;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS task        TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS solution    TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS before_images TEXT[];

ALTER TABLE blog ADD COLUMN IF NOT EXISTS slug         TEXT;
ALTER TABLE blog ADD COLUMN IF NOT EXISTS excerpt      TEXT;
ALTER TABLE blog ADD COLUMN IF NOT EXISTS layout_style TEXT DEFAULT 'standard';
ALTER TABLE blog ADD COLUMN IF NOT EXISTS category     TEXT;
ALTER TABLE blog ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

ALTER TABLE leads ADD COLUMN IF NOT EXISTS client_name    TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS client_contact TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_topic  TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_range   TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes          TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS files_url      TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS details        JSONB DEFAULT '{}'::jsonb;

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- ─── ROW LEVEL SECURITY (ДОЗВІЛЬНИЙ РЕЖИМ) ───────────────────
-- Вся безпека адмінки забезпечена JWT-middleware у Next.js.
-- Supabase RLS відкрита для анонімного ключа — це навмисно.

ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing conflicting policies first
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE tablename IN ('categories','gallery','reviews','leads','blog','site_events','site_settings')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Recreate clean permissive policies
CREATE POLICY "public_all_categories"    ON categories    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_gallery"       ON gallery       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_reviews"       ON reviews       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_leads"         ON leads         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_blog"          ON blog          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_site_events"   ON site_events   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ─── ІНДЕКСИ ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS blog_slug_idx       ON blog(slug);
CREATE INDEX IF NOT EXISTS blog_created_idx    ON blog(created_at DESC);
CREATE INDEX IF NOT EXISTS gallery_featured_idx ON gallery(is_featured);
CREATE INDEX IF NOT EXISTS leads_status_idx    ON leads(status);
CREATE INDEX IF NOT EXISTS reviews_approved_idx ON reviews(is_approved);

-- ─── STORAGE ─────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  DROP POLICY IF EXISTS "public_read_site_media"   ON storage.objects;
  DROP POLICY IF EXISTS "public_upload_site_media" ON storage.objects;
  DROP POLICY IF EXISTS "public_delete_site_media" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "public_read_site_media"
  ON storage.objects FOR SELECT USING (bucket_id = 'site-media');

CREATE POLICY "public_upload_site_media"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "public_delete_site_media"
  ON storage.objects FOR DELETE USING (bucket_id = 'site-media');

-- ═══════════════════════════════════════════════════════════════
-- НОВІ ТАБЛИЦІ ТА ОНОВЛЕННЯ (Масштабне оновлення 2025)
-- ═══════════════════════════════════════════════════════════════

-- ─── ТАБЛИЦЯ PROJECTS (Каталог об'єктів) ─────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL, -- 'Кухні', 'Шафи', 'Комоди', 'Реставрація', 'Трансформери', 'Дитячі'
  image_urls        TEXT[] DEFAULT '{}',
  before_images     TEXT[] DEFAULT '{}',
  
  -- Характеристики залежно від категорії (JSONB)
  specifications    JSONB DEFAULT '{}',
  
  -- Цінова інформація
  price_from        NUMERIC,
  price_to          NUMERIC,
  price_exact       NUMERIC,
  price_note        TEXT, -- "Орієнтовна вартість"
  
  -- Матеріали та фурнітура
  materials         TEXT[],
  furniture_brand   TEXT, -- 'Blum', 'Hettich', 'Muller', 'Бюджет', 'Середній', 'Преміум'
  
  -- SEO поля
  meta_title        TEXT,
  meta_description  TEXT,
  slug              TEXT UNIQUE,
  
  -- Статус та видимість
  is_published      BOOLEAN DEFAULT false,
  is_featured       BOOLEAN DEFAULT false,
  sort_order        INTEGER DEFAULT 0,
  
  -- Метадані
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ─── ОНОВЛЕННЯ ТАБЛИЦІ BLOG (SEO поля) ─────────────────────────
ALTER TABLE blog ADD COLUMN IF NOT EXISTS meta_title       TEXT;
ALTER TABLE blog ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog ADD COLUMN IF NOT EXISTS tags             TEXT[] DEFAULT '{}';
ALTER TABLE blog ADD COLUMN IF NOT EXISTS alt_text         TEXT; -- для головного зображення

-- ─── ОНОВЛЕННЯ ТАБЛИЦІ REVIEWS (Модерація та Google Auth) ─────
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_published  BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS google_id     TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS google_email  TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS avatar_url    TEXT;

-- ─── ОНОВЛЕННЯ ТАБЛИЦІ GALLERY (alt_text для SEO) ──────────────
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS alt_text      TEXT;

-- ─── RLS ДЛЯ НОВИХ ТАБЛИЦЬ ────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all_projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- ─── ІНДЕКСИ ДЛЯ НОВИХ ТАБЛИЦЬ ────────────────────────────────
CREATE INDEX IF NOT EXISTS projects_category_idx     ON projects(category);
CREATE INDEX IF NOT EXISTS projects_published_idx  ON projects(is_published);
CREATE INDEX IF NOT EXISTS projects_featured_idx   ON projects(is_featured);
CREATE INDEX IF NOT EXISTS projects_slug_idx       ON projects(slug);
CREATE INDEX IF NOT EXISTS blog_tags_idx           ON blog USING GIN(tags);
CREATE INDEX IF NOT EXISTS reviews_google_id_idx   ON reviews(google_id);

-- ─── ТРИГЕР ДЛЯ updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- ГОТОВО ✓
-- ═══════════════════════════════════════════════════════════════
