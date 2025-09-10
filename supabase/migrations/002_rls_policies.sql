-- Create read-only views for public API access
CREATE VIEW public.v_events AS 
SELECT 
  event_datetime, 
  currency_code, 
  country, 
  canonical_indicator, 
  report_name, 
  impact, 
  forecast, 
  actual, 
  previous, 
  units, 
  sentiment 
FROM public.economic_events;

CREATE VIEW public.v_fx AS 
SELECT 
  pair, 
  price, 
  change_percent, 
  last_update 
FROM public.fx_quotes;

-- RLS Policies for anon access (read-only)
CREATE POLICY "Allow anon read currencies" ON public.currencies
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon read indicators" ON public.indicators
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon read events view" ON public.economic_events
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon read fx view" ON public.fx_quotes
  FOR SELECT TO anon USING (true);

-- Service role has full access (for Edge Functions)
CREATE POLICY "Service role full access currencies" ON public.currencies
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access indicators" ON public.indicators
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access events" ON public.economic_events
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access fx" ON public.fx_quotes
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access etl_cursor" ON public.etl_cursor
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access etl_log" ON public.etl_log
  FOR ALL TO service_role USING (true);

-- Grant permissions on views
GRANT SELECT ON public.v_events TO anon;
GRANT SELECT ON public.v_fx TO anon;
