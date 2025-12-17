import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Error message component that reserves space to prevent CLS
const FormError = ({ message }: { message?: string }) => (
  <p
    className="text-xs text-destructive min-h-[1rem]"
    style={{ visibility: message ? 'visible' : 'hidden' }}
    aria-live="polite"
  >
    {message || '\u00A0'}
  </p>
);

const trackingFieldNames = [
  'gclid',
  'wbraid',
  'gbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_campaignid',
  'utm_adgroupid',
  'utm_term',
  'utm_device',
  'utm_creative',
  'utm_network',
  'utm_assetgroup',
  'utm_headline',
  'landing_page',
  'referrer',
  'session_id'
] as const;

type TrackingFieldName = typeof trackingFieldNames[number];
type TrackingFields = Record<TrackingFieldName, string>;

interface LeadFormData extends TrackingFields {
  address: string;
  phone: string;
  smsConsent: boolean;
  firstName: string;
  lastName: string;
  email: string;
  website: string;
}

interface LeadFormProps {
  slug: string;
  adGroup?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  compact?: boolean;
}

const LeadForm = ({
  slug,
  adGroup = '',
  title = "Get Your FREE Cash Offer",
  subtitle = "No obligation. Takes less than 60 seconds.",
  buttonText = "Get My Cash Offer",
  compact = false
}: LeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LeadFormData>({
    address: '',
    phone: '',
    smsConsent: false,
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    gclid: '',
    wbraid: '',
    gbraid: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_campaignid: '',
    utm_adgroupid: '',
    utm_term: '',
    utm_device: '',
    utm_creative: '',
    utm_network: '',
    utm_assetgroup: '',
    utm_headline: '',
    landing_page: '',
    referrer: '',
    session_id: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Capture tracking parameters from URL and session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const updates: Partial<TrackingFields> = {};
    let storage: Storage | null = null;

    try {
      storage = window.sessionStorage;
    } catch (error) {
      console.warn('Session storage is unavailable:', error);
    }

    const generateFallbackSessionId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    trackingFieldNames.forEach((key) => {
      let value = '';

      if (key === 'landing_page') {
        value = `/${slug}`;
      } else if (key === 'referrer') {
        value = document.referrer || '';
      } else if (key === 'session_id') {
        const storedSessionId = storage?.getItem(key) || '';
        value = storedSessionId
          || (typeof window.crypto !== 'undefined' && typeof window.crypto.randomUUID === 'function'
            ? window.crypto.randomUUID()
            : generateFallbackSessionId());
      } else {
        const paramValue = searchParams.get(key) || '';
        const storedValue = storage?.getItem(key) || '';
        value = paramValue || storedValue;
      }

      if (!value) {
        value = storage?.getItem(key) || '';
      }

      if (value && storage) {
        try {
          storage.setItem(key, value);
        } catch (error) {
          console.warn('Unable to persist tracking data to session storage:', error);
        }
      }

      updates[key] = value;
    });

    setFormData((prev) => ({ ...prev, ...updates }));
  }, [slug]);

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10;
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return validateEmail(value) ? '' : 'Please enter a valid email';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        return validatePhone(value) ? '' : 'Please enter a valid phone number';
      case 'address':
        return value.trim() ? '' : 'Property address is required';
      default:
        return '';
    }
  };

  const handleInputChange = <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    let processedValue = value;

    if (field === 'phone' && typeof value === 'string') {
      processedValue = formatPhoneNumber(value) as LeadFormData[K];
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof LeadFormData];
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.address.trim() !== '' &&
      validateEmail(formData.email) &&
      validatePhone(formData.phone) &&
      formData.smsConsent
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.website) {
      navigate("/thank-you");
      return;
    }

    // Validate all fields
    const newErrors: Record<string, string> = {};
    ['firstName', 'lastName', 'email', 'phone', 'address'].forEach((field) => {
      const value = formData[field as keyof LeadFormData];
      if (typeof value === 'string') {
        const error = validateField(field, value);
        if (error) newErrors[field] = error;
      }
    });

    if (!formData.smsConsent) {
      newErrors.smsConsent = 'Please agree to the terms to continue';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-lead', {
        body: {
          address: formData.address,
          phone: formData.phone,
          smsConsent: formData.smsConsent,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          website: formData.website,
          adGroup: adGroup,
          ...Object.fromEntries(
            trackingFieldNames.map((key) => [key, formData[key]])
          ),
        }
      });

      if (error) throw error;

      // Fire tracking event
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'form_submission',
          form_name: 'lead_form',
          landing_page: slug,
          ad_group: adGroup,
        });
      }

      toast({
        title: "Success!",
        description: "Your information has been submitted. We'll be in touch soon!",
      });

      navigate("/thank-you");
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`bg-background/95 backdrop-blur shadow-xl ${compact ? '' : 'max-w-md'}`}>
      <CardHeader className={`text-center ${compact ? 'pb-2' : 'pb-4'}`}>
        <CardTitle className={`font-bold text-primary ${compact ? 'text-xl' : 'text-2xl'} mb-1`}>
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>

      <CardContent className={compact ? 'pb-4' : 'pb-6'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="address" className="flex items-center space-x-1 text-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>Property Address *</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, City, State, ZIP"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              required
              className={`h-12 ${errors.address ? 'border-destructive' : ''}`}
            />
            <FormError message={errors.address} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-foreground text-sm">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={`h-12 ${errors.firstName ? 'border-destructive' : ''}`}
              />
              <FormError message={errors.firstName} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-foreground text-sm">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={`h-12 ${errors.lastName ? 'border-destructive' : ''}`}
              />
              <FormError message={errors.lastName} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="flex items-center space-x-1 text-foreground text-sm">
              <Phone className="w-4 h-4" />
              <span>Phone Number *</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 555-5555"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={`h-12 ${errors.phone ? 'border-destructive' : ''}`}
            />
            <FormError message={errors.phone} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-foreground text-sm">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
            />
            <FormError message={errors.email} />
          </div>

          {/* Honeypot field */}
          <div
            style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <Input
              name="website"
              type="text"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="smsConsent"
              checked={formData.smsConsent}
              onChange={(e) => handleInputChange('smsConsent', e.target.checked)}
              className="mt-1 flex-shrink-0"
            />
            <Label htmlFor="smsConsent" className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <a href="/terms-conditions" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              . By submitting, you consent to receive SMS/calls from Reddtrow Properties LLC. Msg & data rates may apply.
            </Label>
          </div>
          <FormError message={errors.smsConsent} />

          {/* Hidden tracking fields */}
          {trackingFieldNames.map((key) => (
            <input key={key} type="hidden" name={key} value={formData[key]} readOnly />
          ))}

          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full h-14 urgency-button font-bold text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                {buttonText}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your information is secure and will never be sold.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadForm;
