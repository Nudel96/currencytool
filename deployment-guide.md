# PAT Macro Calendar - Deployment Guide

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Vercel CLI](https://vercel.com/cli) (optional)
- [pnpm](https://pnpm.io/) package manager
- FinanceFlow API key: `b1b3c1fec3384de31d8a53b3db5bd71d5dd958f24ecdedc0aba0bfd44a77456a`

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
```bash
# Login to Supabase
supabase login

# Create new project
supabase projects create pat-macro-calendar

# Link local project
supabase link --project-ref YOUR_PROJECT_REF
```

### 1.2 Set Environment Variables in Supabase
```bash
# Set FinanceFlow API credentials
supabase secrets set FINANCEFLOW_API_BASE=https://financeflowapi.com/api/v1
supabase secrets set FINANCEFLOW_API_KEY=b1b3c1fec3384de31d8a53b3db5bd71d5dd958f24ecdedc0aba0bfd44a77456a
supabase secrets set TIMEZONE_DEFAULT=Europe/Berlin
```

### 1.3 Run Database Migrations
```bash
# Reset database with migrations and seeds
supabase db reset

# Or apply migrations individually
supabase db push
```

### 1.4 Deploy Edge Functions
```bash
# Deploy calendar update function
supabase functions deploy update_calendar

# Deploy FX update function  
supabase functions deploy update_fx

# Verify functions are deployed
supabase functions list
```

### 1.5 Configure Cron Jobs
```bash
# Update the cron setup migration with your project URL
# Edit supabase/migrations/004_cron_setup.sql
# Replace 'your-project-ref' with your actual project reference

# Apply cron setup
supabase db push
```

### 1.6 Test Edge Functions
```bash
# Test calendar function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/update_calendar' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'

# Test FX function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/update_fx' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

## Step 2: Vercel Deployment

### 2.1 Install Dependencies
```bash
# Install all dependencies
pnpm install

# Build shared package
cd packages/shared && pnpm build
```

### 2.2 Configure Environment Variables
Create `.env` file in root:
```env
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TIMEZONE_DEFAULT=Europe/Berlin
```

### 2.3 Deploy to Vercel
```bash
# Option 1: Using Vercel CLI
vercel --prod

# Option 2: Connect GitHub repository in Vercel dashboard
# 1. Go to vercel.com/dashboard
# 2. Import your GitHub repository
# 3. Set environment variables in Vercel dashboard
# 4. Deploy
```

### 2.4 Set Vercel Environment Variables
In Vercel dashboard, add these environment variables:
- `PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `TIMEZONE_DEFAULT`: Europe/Berlin

## Step 3: Verification & Testing

### 3.1 Database Verification
```sql
-- Check currencies are seeded
SELECT * FROM public.currencies;

-- Check indicators are seeded  
SELECT * FROM public.indicators LIMIT 10;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';
```

### 3.2 API Testing
```bash
# Test currency overview endpoint
curl 'https://your-app.vercel.app/api/currency/USD/overview'

# Should return JSON with currency, pairs, and events
```

### 3.3 Frontend Testing
1. Visit your deployed Vercel URL
2. Verify currency tabs work
3. Check FX quotes display
4. Verify economic events table loads
5. Test currency switching

### 3.4 ETL Monitoring
```sql
-- Check ETL logs
SELECT * FROM public.etl_log ORDER BY started_at DESC LIMIT 10;

-- Check recent events
SELECT currency_code, COUNT(*) as event_count 
FROM public.economic_events 
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY currency_code;

-- Check FX quotes
SELECT pair, price, last_update 
FROM public.fx_quotes 
ORDER BY last_update DESC;
```

## Step 4: Monitoring & Maintenance

### 4.1 Supabase Monitoring
- Monitor function logs in Supabase dashboard
- Check database performance metrics
- Monitor API usage and rate limits

### 4.2 Vercel Monitoring  
- Monitor function execution times
- Check build and deployment logs
- Monitor bandwidth usage

### 4.3 FinanceFlow API Monitoring
- Monitor API rate limits
- Check for API errors in ETL logs
- Verify data freshness

## Troubleshooting

### Common Issues

1. **Edge Functions Not Triggering**
   - Check cron job configuration
   - Verify function URLs in cron setup
   - Check Supabase function logs

2. **API Rate Limits**
   - Monitor FinanceFlow API usage
   - Adjust ETL frequency if needed
   - Implement exponential backoff

3. **Database Connection Issues**
   - Check RLS policies
   - Verify service role permissions
   - Monitor connection pool usage

4. **Frontend Build Errors**
   - Ensure shared package is built
   - Check TypeScript configuration
   - Verify environment variables

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Check slow queries
   SELECT query, mean_exec_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_exec_time DESC LIMIT 10;
   
   -- Analyze table statistics
   ANALYZE public.economic_events;
   ANALYZE public.fx_quotes;
   ```

2. **API Optimization**
   - Monitor P95 response times
   - Optimize database queries
   - Tune cache TTL values

3. **Frontend Optimization**
   - Monitor bundle size
   - Optimize image loading
   - Implement service worker caching

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Service role key not exposed to client
- [ ] API rate limiting configured
- [ ] HTTPS enforced on all endpoints
- [ ] Environment variables properly secured
- [ ] Database backups configured
- [ ] Function logs don't contain sensitive data

## Success Metrics

- [ ] P95 API response time < 300ms
- [ ] ETL jobs running successfully every 10min/2min
- [ ] All 8 currencies showing data
- [ ] FX quotes updating regularly
- [ ] Zero 5xx errors in production
- [ ] Economic events displaying with correct sentiment

## Support

For issues or questions:
1. Check Supabase function logs
2. Review ETL logs in database
3. Monitor Vercel function logs
4. Verify FinanceFlow API status
