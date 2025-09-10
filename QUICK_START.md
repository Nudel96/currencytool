# 🚀 PAT Macro Calendar - Quick Start Guide

## ✅ Was ist bereits fertig:

1. **✅ Vollständige Codebase** - Alle 78 Dateien committed und gepusht
2. **✅ Lokale Dependencies** - pnpm install erfolgreich abgeschlossen
3. **✅ Shared Package** - TypeScript build erfolgreich
4. **✅ Environment Setup** - .env Datei erstellt

## 🎯 Nächste Schritte für dich:

### 1. Supabase Projekt erstellen (5 Minuten)
```
1. Gehe zu https://supabase.com/dashboard
2. Klicke "New Project" 
3. Name: pat-macro-calendar
4. Region: Europe (Frankfurt)
5. Erstelle das Projekt
```

### 2. Database Schema einrichten (10 Minuten)
```
1. Öffne "SQL Editor" in Supabase
2. Kopiere Inhalt aus supabase/migrations/001_initial_schema.sql
3. Führe aus
4. Wiederhole für 002_rls_policies.sql und 003_seed_data.sql
```

### 3. Environment Variables setzen (5 Minuten)
```
1. Kopiere Project URL und API Keys aus Supabase Settings → API
2. Aktualisiere .env Datei mit echten Werten
3. Setze Secrets in Supabase Settings → Edge Functions:
   - FINANCEFLOW_API_KEY: b1b3c1fec3384de31d8a53b3db5bd71d5dd958f24ecdedc0aba0bfd44a77456a
   - FINANCEFLOW_API_BASE: https://financeflowapi.com/api/v1
   - TIMEZONE_DEFAULT: Europe/Berlin
```

### 4. Edge Functions deployen (10 Minuten)
```
1. Gehe zu "Edge Functions" in Supabase
2. Erstelle Function "update_calendar"
3. Kopiere Code aus supabase/functions/update_calendar/index.ts
4. Erstelle Function "update_fx" 
5. Kopiere Code aus supabase/functions/update_fx/index.ts
```

### 5. Cron Jobs aktivieren (5 Minuten)
```
1. Aktiviere pg_cron Extension in Database → Extensions
2. Führe Cron Setup aus supabase/migrations/004_cron_setup.sql aus
3. Ersetze YOUR_PROJECT_REF mit deiner echten Project Reference
```

### 6. Lokale Entwicklung starten (2 Minuten)
```bash
pnpm dev
```

### 7. Vercel Deployment (5 Minuten)
```
1. Gehe zu https://vercel.com/dashboard
2. Import GitHub Repository: Nudel96/currencytool
3. Setze Environment Variables (aus .env)
4. Deploy!
```

## 📋 Checkliste:

- [ ] Supabase Projekt erstellt
- [ ] Database Migrationen ausgeführt
- [ ] Environment Variables gesetzt
- [ ] Edge Functions deployed
- [ ] Cron Jobs aktiviert
- [ ] Lokale Entwicklung läuft
- [ ] Vercel Deployment erfolgreich

## 🆘 Bei Problemen:

1. **Detaillierte Anleitung**: `MANUAL_SUPABASE_SETUP.md`
2. **Deployment Guide**: `deployment-guide.md`
3. **Projekt Übersicht**: `PROJECT_SUMMARY.md`

## 🎉 Ergebnis:

Nach diesen Schritten hast du:
- ✅ Vollständige Economic Calendar App
- ✅ 8 Währungen mit Live-Daten
- ✅ Automatische Updates alle 2-10 Minuten
- ✅ Professional Dark Theme UI
- ✅ Production-ready Deployment

**Geschätzte Zeit: 30-45 Minuten** für komplettes Setup!

Die App ist bereits vollständig implementiert - du musst nur noch die Infrastruktur einrichten! 🚀
