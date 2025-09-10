# Manual Supabase Setup für PAT Macro Calendar

Da die CLI-Installation Probleme macht, hier die manuelle Setup-Anleitung über das Supabase Dashboard:

## 1. Supabase Projekt erstellen

1. Gehe zu https://supabase.com/dashboard
2. Klicke auf "New Project"
3. Wähle deine Organisation
4. Projekt Name: `pat-macro-calendar`
5. Database Password: Wähle ein sicheres Passwort
6. Region: Europe (Frankfurt) - am nächsten zu Deutschland
7. Klicke "Create new project"

## 2. Database Schema einrichten

### 2.1 SQL Editor öffnen
1. Gehe zu "SQL Editor" im linken Menü
2. Klicke "New query"

### 2.2 Schema-Migrationen ausführen

**Migration 1: Initial Schema**
```sql
-- Kopiere den Inhalt aus supabase/migrations/001_initial_schema.sql
-- Füge ihn in den SQL Editor ein und führe ihn aus
```

**Migration 2: RLS Policies**
```sql
-- Kopiere den Inhalt aus supabase/migrations/002_rls_policies.sql
-- Füge ihn in den SQL Editor ein und führe ihn aus
```

**Migration 3: Seed Data**
```sql
-- Kopiere den Inhalt aus supabase/migrations/003_seed_data.sql
-- Füge ihn in den SQL Editor ein und führe ihn aus
```

## 3. Environment Variables setzen

### 3.1 Secrets für Edge Functions
1. Gehe zu "Settings" → "Edge Functions"
2. Füge folgende Secrets hinzu:
   - `FINANCEFLOW_API_BASE`: `https://financeflowapi.com/api/v1`
   - `FINANCEFLOW_API_KEY`: `b1b3c1fec3384de31d8a53b3db5bd71d5dd958f24ecdedc0aba0bfd44a77456a`
   - `TIMEZONE_DEFAULT`: `Europe/Berlin`

### 3.2 Projekt-URLs kopieren
1. Gehe zu "Settings" → "API"
2. Kopiere:
   - **Project URL**: Für `PUBLIC_SUPABASE_URL`
   - **anon public**: Für `PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: Für `SUPABASE_SERVICE_ROLE_KEY` (GEHEIM!)

## 4. Edge Functions deployen

Da wir keine CLI haben, müssen wir die Functions manuell erstellen:

### 4.1 Calendar Update Function
1. Gehe zu "Edge Functions" im Dashboard
2. Klicke "Create Function"
3. Name: `update_calendar`
4. Kopiere den Code aus `supabase/functions/update_calendar/index.ts`
5. Füge ihn ein und speichere

### 4.2 FX Update Function
1. Erstelle eine weitere Function
2. Name: `update_fx`
3. Kopiere den Code aus `supabase/functions/update_fx/index.ts`
4. Füge ihn ein und speichere

## 5. Cron Jobs einrichten

### 5.1 pg_cron Extension aktivieren
1. Gehe zu "Database" → "Extensions"
2. Suche nach "pg_cron"
3. Aktiviere die Extension

### 5.2 Cron Jobs erstellen
1. Gehe zum SQL Editor
2. Führe folgende Queries aus (ersetze `YOUR_PROJECT_REF` mit deiner echten Project Reference):

```sql
-- Calendar Update (alle 10 Minuten)
SELECT cron.schedule(
  'update-calendar',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/update_calendar',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- FX Update (alle 2 Minuten)
SELECT cron.schedule(
  'update-fx',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/update_fx',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
  );
  $$
);
```

## 6. .env Datei aktualisieren

Aktualisiere die `.env` Datei mit deinen echten Werten:

```env
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_real_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key
FINANCEFLOW_API_BASE=https://financeflowapi.com/api/v1
FINANCEFLOW_API_KEY=b1b3c1fec3384de31d8a53b3db5bd71d5dd958f24ecdedc0aba0bfd44a77456a
TIMEZONE_DEFAULT=Europe/Berlin
```

## 7. Testing

### 7.1 Database Test
```sql
-- Prüfe ob Currencies geladen sind
SELECT * FROM public.currencies;

-- Prüfe ob Indicators geladen sind
SELECT COUNT(*) FROM public.indicators;
```

### 7.2 Function Test
1. Gehe zu "Edge Functions"
2. Teste beide Functions manuell
3. Prüfe die Logs auf Fehler

### 7.3 Cron Test
```sql
-- Prüfe Cron Jobs
SELECT * FROM cron.job;

-- Prüfe ETL Logs
SELECT * FROM public.etl_log ORDER BY started_at DESC LIMIT 5;
```

## 8. Vercel Deployment

1. Gehe zu https://vercel.com/dashboard
2. Klicke "Import Project"
3. Verbinde dein GitHub Repository: `https://github.com/Nudel96/currencytool`
4. Setze die Environment Variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TIMEZONE_DEFAULT`
5. Deploy!

## 9. Finale Verifikation

1. Besuche deine Vercel-URL
2. Prüfe ob Currency-Tabs funktionieren
3. Prüfe ob FX-Quotes laden
4. Prüfe ob Economic Events angezeigt werden

## Troubleshooting

**Problem**: Functions laden nicht
- **Lösung**: Prüfe die Secrets in Edge Functions Settings

**Problem**: Keine Daten in Tabellen
- **Lösung**: Führe die Functions manuell aus

**Problem**: Cron Jobs laufen nicht
- **Lösung**: Prüfe ob pg_cron Extension aktiviert ist

**Problem**: API Errors
- **Lösung**: Prüfe FinanceFlow API Key und Rate Limits

## Support

Bei Problemen:
1. Prüfe Supabase Function Logs
2. Prüfe `etl_log` Tabelle für Fehler
3. Prüfe Vercel Function Logs
4. Teste API Endpoints manuell

Das Setup ist komplex, aber alle Schritte sind dokumentiert. Folge der Anleitung Schritt für Schritt!
