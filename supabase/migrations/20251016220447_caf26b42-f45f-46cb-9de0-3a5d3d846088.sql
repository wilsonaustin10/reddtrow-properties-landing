-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  sms_consent BOOLEAN DEFAULT false,
  
  -- Property Information
  address TEXT NOT NULL,
  is_listed TEXT,
  condition TEXT,
  timeline TEXT,
  asking_price TEXT,
  
  -- Integration Status
  zapier_sent BOOLEAN DEFAULT false,
  zapier_sent_at TIMESTAMP WITH TIME ZONE,
  ghl_sent BOOLEAN DEFAULT false,
  ghl_sent_at TIMESTAMP WITH TIME ZONE,
  ghl_error TEXT,
  ghl_response TEXT
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert/update leads
CREATE POLICY "Service role can manage leads"
ON public.leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index on created_at for faster queries
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- Create index on email for lookups
CREATE INDEX idx_leads_email ON public.leads(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_leads_updated_at();