-- Add attribution column to leads table for capturing marketing metadata
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS attribution JSONB;

-- Index attribution data for flexible querying
CREATE INDEX IF NOT EXISTS idx_leads_attribution ON public.leads USING GIN (attribution);
