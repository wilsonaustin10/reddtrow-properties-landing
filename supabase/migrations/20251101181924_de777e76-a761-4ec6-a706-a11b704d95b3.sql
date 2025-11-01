-- Secure the leads table by blocking all public access
-- Only allow service role (edge functions) to manage leads

-- Block all anonymous access to leads table
CREATE POLICY "Block public SELECT on leads" 
ON public.leads 
FOR SELECT 
TO anon 
USING (false);

CREATE POLICY "Block public INSERT on leads" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (false);

CREATE POLICY "Block public UPDATE on leads" 
ON public.leads 
FOR UPDATE 
TO anon 
USING (false);

CREATE POLICY "Block public DELETE on leads" 
ON public.leads 
FOR DELETE 
TO anon 
USING (false);

-- Block all authenticated user access (no user auth in this app)
CREATE POLICY "Block authenticated SELECT on leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (false);

CREATE POLICY "Block authenticated INSERT on leads" 
ON public.leads 
FOR INSERT 
TO authenticated 
WITH CHECK (false);

CREATE POLICY "Block authenticated UPDATE on leads" 
ON public.leads 
FOR UPDATE 
TO authenticated 
USING (false);

CREATE POLICY "Block authenticated DELETE on leads" 
ON public.leads 
FOR DELETE 
TO authenticated 
USING (false);