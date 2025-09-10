# PAT Macro Calendar

A production-ready economic events and FX quotes dashboard built with SvelteKit, Supabase, and FinanceFlow API.

## Features

- **Real-time Economic Calendar**: High and Medium impact events for 8 major currencies
- **FX Quotes Dashboard**: Live currency pair quotes with change indicators  
- **Sentiment Analysis**: Automated bullish/bearish/neutral sentiment calculation
- **Dark Theme UI**: Professional trading-style interface
- **Performance Optimized**: P95 < 300ms API responses with caching
- **Auto-refresh**: Calendar updates every 10 min, FX quotes every 2 min

## Architecture

```
root/
  apps/
    web/               # SvelteKit + Tailwind frontend
  packages/
    shared/            # TypeScript types, utilities, mappings
  supabase/
    migrations/        # Database schema and seeds
    functions/
      update_calendar/ # Economic events ETL
      update_fx/       # FX quotes ETL
```

## Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS, TypeScript
- **Backend**: Supabase (PostgreSQL, Edge Functions, Cron)
- **API**: FinanceFlow API integration
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Supported Currencies

- USD (US Dollar)
- EUR (Euro) 
- GBP (British Pound)
- JPY (Japanese Yen)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- CHF (Swiss Franc)
- NZD (New Zealand Dollar)

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repo-url>
   cd pat-macro-calendar
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Fill in your Supabase and FinanceFlow API credentials
   ```

3. **Run database migrations**:
   ```bash
   supabase db reset
   ```

4. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy update_calendar
   supabase functions deploy update_fx
   ```

5. **Start development server**:
   ```bash
   pnpm dev
   ```

## Environment Variables

```env
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# FinanceFlow API
FINANCEFLOW_API_BASE=https://financeflowapi.com/api/v1
FINANCEFLOW_API_KEY=your-api-key

# Configuration
TIMEZONE_DEFAULT=Europe/Berlin
```

## Database Schema

- **currencies**: Currency codes and country mappings
- **indicators**: Economic indicators with sentiment rules
- **economic_events**: Calendar events with sentiment analysis
- **fx_quotes**: Real-time FX pair quotes
- **etl_log**: ETL job monitoring and logging

## API Endpoints

- `GET /api/currency/{code}/overview` - Currency overview with events and FX quotes
- Supports caching with ETag headers and 60s TTL

## Deployment

### Supabase Setup
1. Create new Supabase project
2. Run migrations: `supabase db reset`
3. Deploy functions: `supabase functions deploy`
4. Set up cron jobs:
   - Calendar: `*/10 * * * *` (every 10 minutes)
   - FX: `*/2 * * * *` (every 2 minutes)

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy with SvelteKit adapter

## Performance

- **API Response Time**: P95 < 300ms (warm)
- **Caching**: 60s in-memory cache + ETag headers
- **Database**: Optimized indexes on query paths
- **Bundle Size**: < 200KB gzipped

## Monitoring

- ETL job logs in `etl_log` table
- Supabase function logs for debugging
- Error tracking with structured logging

## Contributing

1. Follow TypeScript strict mode
2. Use Prettier for formatting
3. Write tests for new features
4. Ensure P95 performance targets

## License

MIT License - see LICENSE file for details.
