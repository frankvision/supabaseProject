-- Das hier führst du EINMAL im Supabase-Dashboard aus (SQL Editor -> New Query -> Run).
-- Es erstellt die Tabelle, in der die Song-Daten wirklich gespeichert werden.

create table songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  tuning text,
  strings text,
  played_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Ein paar Beispiel-Songs zum Testen, direkt in die Tabelle eingefügt:
insert into songs (title, artist, tuning, strings) values
  ('Enter Sandman', 'Metallica', 'Standard E', '6 Saiter'),
  ('Master of Puppets', 'Metallica', 'Drop D', '6 Saiter'),
  ('Bulls on Parade', 'Rage Against the Machine', 'Drop D', '6 Saiter');
