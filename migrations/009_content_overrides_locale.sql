ALTER TABLE content_overrides
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ru';

INSERT INTO content_overrides (key, value, updated_by, updated_at, locale)
  SELECT key, value, updated_by, updated_at, 'ge'
  FROM content_overrides
  WHERE locale = 'ru'
  ON CONFLICT DO NOTHING;

ALTER TABLE content_overrides DROP CONSTRAINT IF EXISTS content_overrides_pkey;
ALTER TABLE content_overrides ADD PRIMARY KEY (key, locale);
