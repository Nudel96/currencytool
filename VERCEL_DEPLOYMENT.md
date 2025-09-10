# 🚀 Vercel Deployment - Schritt für Schritt

## Automatisches Deployment

### 1. Vercel Dashboard öffnen
**Gehe zu**: https://vercel.com/dashboard

### 2. Repository importieren
1. **Klicke**: "Add New..." → "Project"
2. **GitHub Repository**: `Nudel96/currencytool`
3. **Import**: Klicke "Import"

### 3. Projekt-Konfiguration
- **Framework Preset**: SvelteKit (wird automatisch erkannt)
- **Root Directory**: `apps/web` (wichtig!)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. Environment Variables setzen
**Füge diese Variables hinzu**:

```
PUBLIC_SUPABASE_URL=https://wvmjwdznzbvlyrrkhwqn.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWp3ZHpuemJ2bHlycmtod3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTE0MDQsImV4cCI6MjA3MzA4NzQwNH0.-FAe7zSC_jEfTOzf50sqptEksNdqJ31yUWmDiMEf8uU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bWp3ZHpuemJ2bHlycmtod3FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUxMTQwNCwiZXhwIjoyMDczMDg3NDA0fQ.0C9Uv57Yd_Us-_cvX1p0g3KtsAb3PN2Ea7kA99DknQQ
TIMEZONE_DEFAULT=Europe/Berlin
```

### 5. Deploy klicken
**Klicke**: "Deploy"

## ⏱️ Deployment-Prozess

1. **Build startet**: ~2-3 Minuten
2. **Deployment**: ~1 Minute
3. **DNS Propagation**: ~1 Minute

**Gesamt**: ~5 Minuten

## ✅ Nach dem Deployment

### Deine App wird verfügbar sein unter:
- **Production URL**: `https://currencytool-[hash].vercel.app`
- **Custom Domain**: Optional konfigurierbar

### Erste Tests:
1. **Currency Tabs**: Sollten alle 8 Währungen zeigen
2. **FX Quotes**: Werden automatisch geladen (kann 2-10 Min dauern)
3. **Economic Events**: Werden automatisch gefüllt (kann 10 Min dauern)

## 🔧 Troubleshooting

### Problem: Build Fehler
**Lösung**: 
- Root Directory auf `apps/web` setzen
- Build Command: `npm run build`

### Problem: Environment Variables
**Lösung**:
- Alle 3 Variables korrekt kopiert?
- Keine Leerzeichen am Anfang/Ende?

### Problem: Keine Daten
**Lösung**:
- Warte 10 Minuten (Cron Jobs brauchen Zeit)
- Prüfe Supabase Function Logs

## 📊 Monitoring

### Vercel Dashboard:
- **Functions**: Überwache API Performance
- **Analytics**: Traffic und Performance
- **Logs**: Debugging bei Problemen

### Supabase Dashboard:
- **Edge Functions**: ETL Job Logs
- **Database**: Daten-Status prüfen

## 🎯 Erfolg-Indikatoren

✅ **Build erfolgreich**: Grüner Status in Vercel
✅ **App lädt**: Currency-Tabs sichtbar
✅ **API funktioniert**: FX-Quotes werden angezeigt
✅ **ETL läuft**: Economic Events erscheinen

## 🚀 Performance

**Erwartete Metriken**:
- **First Load**: < 2 Sekunden
- **API Response**: < 300ms (P95)
- **Lighthouse Score**: > 90

Das PAT Macro Calendar ist dann vollständig live! 🎉
