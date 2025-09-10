-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage on cron schema to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule calendar update job (every 10 minutes)
SELECT cron.schedule(
  'update-calendar',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/update_calendar',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- Schedule FX update job (every 2 minutes)
SELECT cron.schedule(
  'update-fx',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/update_fx',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- Create a function to manually trigger ETL jobs (for testing)
CREATE OR REPLACE FUNCTION trigger_etl_job(job_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result TEXT;
BEGIN
  IF job_name = 'calendar' THEN
    SELECT net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/update_calendar',
      headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
    ) INTO result;
  ELSIF job_name = 'fx' THEN
    SELECT net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/update_fx',
      headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
    ) INTO result;
  ELSE
    RAISE EXCEPTION 'Unknown job name: %', job_name;
  END IF;
  
  RETURN 'Triggered ' || job_name || ' job';
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION trigger_etl_job(TEXT) TO service_role;
