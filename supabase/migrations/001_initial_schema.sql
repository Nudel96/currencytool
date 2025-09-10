-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create currencies table
CREATE TABLE IF NOT EXISTS public.currencies (
  code TEXT PRIMARY KEY,          -- 'USD','EUR',...
  name TEXT NOT NULL,             -- 'United States Dollar', etc.
  country TEXT NOT NULL           -- 'United States','European Union','United Kingdom',...
);

-- Create indicators table for sentiment rules
CREATE TABLE IF NOT EXISTS public.indicators (
  id SERIAL PRIMARY KEY,
  canonical_name TEXT UNIQUE NOT NULL, -- e.g. 'CPI YoY','GDP QoQ','Unemployment Rate'
  positive_is_bullish BOOLEAN NOT NULL DEFAULT TRUE,  -- false e.g. for Unemployment Rate, Jobless Claims, Trade Deficit
  surprise_tolerance NUMERIC DEFAULT 0.0               -- optional: threshold for Neutral classification
);

-- Create economic events table
CREATE TABLE IF NOT EXISTS public.economic_events (
  id BIGSERIAL PRIMARY KEY,
  currency_code TEXT NOT NULL REFERENCES public.currencies(code) ON DELETE CASCADE,
  country TEXT NOT NULL,                -- event country
  report_name TEXT NOT NULL,            -- raw API name
  canonical_indicator TEXT,             -- matched canonical name (nullable if unknown)
  impact TEXT NOT NULL,                 -- 'High' | 'Medium'
  event_datetime TIMESTAMPTZ NOT NULL,  -- UTC from API; convert to local in UI
  forecast NUMERIC,                     -- consensus
  actual NUMERIC,                       -- actual
  previous NUMERIC,                     -- previous
  units TEXT,                           -- '%','K','M','Index','Rate','pts','bbl',...
  source TEXT DEFAULT 'FinanceFlow',
  revised NUMERIC,                      -- optional revised actual/previous
  sentiment TEXT,                       -- 'Bullish' | 'Bearish' | 'Neutral' (precomputed)
  ext_uid TEXT,                         -- stable external identifier if available
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country, report_name, event_datetime)
);

-- Create FX quotes table
CREATE TABLE IF NOT EXISTS public.fx_quotes (
  pair TEXT PRIMARY KEY,                  -- 'EURUSD','USDJPY'
  price NUMERIC,
  bid NUMERIC,
  ask NUMERIC,
  open NUMERIC,
  high NUMERIC,
  low NUMERIC,
  change_abs NUMERIC,
  change_percent NUMERIC,
  last_update TIMESTAMPTZ
);

-- Create ETL tracking tables
CREATE TABLE IF NOT EXISTS public.etl_cursor (
  name TEXT PRIMARY KEY,
  last_run TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.etl_log (
  id BIGSERIAL PRIMARY KEY,
  job TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  ok BOOLEAN,
  message TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_currency_time ON public.economic_events(currency_code, event_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_events_canonical ON public.economic_events(canonical_indicator);
CREATE INDEX IF NOT EXISTS idx_events_impact ON public.economic_events(impact);
CREATE INDEX IF NOT EXISTS idx_fx_last_update ON public.fx_quotes(last_update DESC);
CREATE INDEX IF NOT EXISTS idx_etl_log_job_time ON public.etl_log(job, started_at DESC);

-- Enable Row Level Security
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fx_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etl_cursor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etl_log ENABLE ROW LEVEL SECURITY;
