import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { CheckCircle2, Clock, DollarSign, MapPin, Phone, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  isListed: string;
  condition: string;
  timeline: string;
  askingPrice: string;
  firstName: string;
  lastName: string;
  email: string;
  website: string;
}

const Hero = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    address: '',
    phone: '',
    smsConsent: false,
    isListed: '',
    condition: '',
    timeline: '',
    askingPrice: '',
    firstName: '',
    lastName: '',
    email: '',
    website: '', // Honeypot field
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

  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

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
        value = window.location.href;
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

    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      toast({
        title: "Submitting your information...",
        description: "Please wait while we process your request.",
      });

      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: {
          address: formData.address,
          phone: formData.phone,
          smsConsent: formData.smsConsent,
          isListed: formData.isListed,
          condition: formData.condition,
          timeline: formData.timeline,
          askingPrice: formData.askingPrice,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          website: formData.website, // Honeypot field
          ...Object.fromEntries(
            trackingFieldNames.map((key) => [key, formData[key]])
          ),
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your information has been submitted successfully. We'll be in touch soon!",
      });
      
      navigate("/thank-you");
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() && formData.lastName.trim() && isAddressSelected && formData.address.trim() && formData.phone.trim() && formData.email.trim() && formData.smsConsent;
      case 2:
        return formData.isListed !== '' && formData.condition && formData.timeline && formData.askingPrice.trim();
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 pb-2">
            <h3 className="text-xl font-semibold text-center mb-4 text-foreground">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </div>
            <AddressAutocomplete
              value={formData.address}
              onChange={(address) => handleInputChange('address', address)}
              onAddressSelect={(isValid) => setIsAddressSelected(isValid)}
              placeholder="Start typing your address..."
              required
              className="h-12"
              isAddressSelected={isAddressSelected}
            />
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-1 text-foreground">
                <Phone className="w-4 h-4" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            {/* Honeypot field - hidden from humans, visible to bots */}
            <div 
              style={{ 
                position: 'absolute', 
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
                pointerEvents: 'none'
              }}
              aria-hidden="true"
            >
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="text"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
            {formData.phone.trim() && (
              <div className="flex items-start space-x-2 mt-4 pt-2">
                <input
                  type="checkbox"
                  id="smsConsent"
                  checked={formData.smsConsent}
                  onChange={(e) => handleInputChange('smsConsent', e.target.checked)}
                  className="mt-1 flex-shrink-0"
                />
                <Label htmlFor="smsConsent" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms-conditions" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  . By submitting this form, you consent to receive SMS messages and/or emails and/or calls from Reddtrow Properties LLC. Message frequency varies. To unsubscribe, follow the instructions provided in our communications. Msg & data rates may apply for SMS. Your information is secure and will not be sold to third parties. Text HELP for HELP, text STOP to cancel.
                </Label>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 pb-2">
            <h3 className="text-xl font-semibold text-center mb-4 text-foreground">Property Information</h3>
            <div className="space-y-3">
              <Label className="text-base font-medium text-foreground">Is your property currently listed with a real estate agent?</Label>
              <RadioGroup
                value={formData.isListed}
                onValueChange={(value) => handleInputChange('isListed', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="yes" id="listed-yes" />
                  <Label htmlFor="listed-yes" className="text-foreground cursor-pointer">Yes, it's currently listed</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="no" id="listed-no" />
                  <Label htmlFor="listed-no" className="text-foreground cursor-pointer">No, it's not listed</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium text-foreground">Property Condition</Label>
              <RadioGroup
                value={formData.condition}
                onValueChange={(value) => handleInputChange('condition', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="poor" id="condition-poor" />
                  <Label htmlFor="condition-poor" className="text-foreground cursor-pointer">Poor (needs major repairs)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="fair" id="condition-fair" />
                  <Label htmlFor="condition-fair" className="text-foreground cursor-pointer">Fair (some repairs needed)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="good" id="condition-good" />
                  <Label htmlFor="condition-good" className="text-foreground cursor-pointer">Good (minor repairs)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="excellent" id="condition-excellent" />
                  <Label htmlFor="condition-excellent" className="text-foreground cursor-pointer">Excellent (move-in ready)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium text-foreground">How quickly do you need to sell?</Label>
              <RadioGroup
                value={formData.timeline}
                onValueChange={(value) => handleInputChange('timeline', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="asap" id="timeline-asap" />
                  <Label htmlFor="timeline-asap" className="text-foreground cursor-pointer">ASAP (within 2 weeks)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="30days" id="timeline-30" />
                  <Label htmlFor="timeline-30" className="text-foreground cursor-pointer">30 days</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="60days" id="timeline-60" />
                  <Label htmlFor="timeline-60" className="text-foreground cursor-pointer">60 days</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="90days" id="timeline-90" />
                  <Label htmlFor="timeline-90" className="text-foreground cursor-pointer">90 days</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="askingPrice" className="text-base font-medium text-foreground">What's your asking price?</Label>
              <Input
                id="askingPrice"
                type="text"
                placeholder="$250,000"
                value={formData.askingPrice}
                onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="lead-form" className="hero-section relative min-h-[40vh] flex items-center py-4 md:py-8 text-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="space-y-3 lg:space-y-6 order-1 lg:order-1">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2 lg:mb-4">
                <div className="success-badge px-3 lg:px-6 py-1 lg:py-3 rounded-full text-sm lg:text-xl font-bold shadow-lg">
                  #1 Nationwide Home Buyers
                </div>
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight">
                Sell Your House 
                <span className="block text-white">Fast for Cash</span>
              </h1>
              
              <p className="text-base md:text-xl lg:text-2xl text-white/90 leading-relaxed">
                Get a fair cash offer in 7 minutes or less. No repairs, no fees, no hassles. 
                Close in as little as 7 days on your timeline.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4 py-3 lg:py-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-urgency" />
                <span className="font-semibold text-sm lg:text-base">Cash Offers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-urgency" />
                <span className="font-semibold text-sm lg:text-base">7-Day Closing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-urgency" />
                <span className="font-semibold text-sm lg:text-base">Any Condition</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-1 md:space-y-0 text-sm lg:text-base text-white/90">
              <span className="font-medium">★★★★★ Highly Rated Homebuyers</span>
              <span className="hidden md:inline">•</span>
              <span className="font-medium">No Obligation • 100% Free</span>
            </div>
          </div>
          
          <div className="max-w-md mx-auto lg:mx-0 order-2 lg:order-2">
            <Card className="lead-form bg-background/95 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-primary mb-2">
                  Get Your FREE Cash Offer
                </CardTitle>
                <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <div className="flex space-x-1">
                    {[1, 2].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full ${
                          step <= currentStep ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="min-h-[400px]">
                    {renderStep()}
                  </div>

                  {trackingFieldNames.map((key) => (
                    <input
                      key={key}
                      type="hidden"
                      name={key}
                      value={formData[key]}
                      readOnly
                    />
                  ))}

                  <div className="flex space-x-3 pt-6 border-t border-border">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="flex-1 h-12"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className={`h-12 ${currentStep === 1 ? 'w-full' : 'flex-1'}`}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!isStepValid()}
                        className="flex-1 urgency-button font-bold h-12"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Get My Cash Offer
                      </Button>
                    )}
                  </div>
                  
                  {currentStep === 2 && (
                    <p className="text-xs text-center text-muted-foreground pt-3 leading-relaxed">
                      By submitting, you agree to receive text messages and calls. 
                      Your information is secure and will never be sold.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;