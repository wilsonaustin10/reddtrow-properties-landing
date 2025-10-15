import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="Amarillo Cash Home Buyers" className="h-24 w-auto" />
            <p className="text-primary-foreground/80 leading-relaxed">
              We're Amarillo's #1 local home buyers - a family-owned business that has been helping 
              Amarillo homeowners sell their properties quickly and fairly for over 10 years.
            </p>
            <div className="flex items-center space-x-2">
              
              
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-urgency" />
                <div>
                  <div className="font-semibold">(806) 803-9859</div>
                  <div className="text-sm text-primary-foreground/80">Call or Text Anytime</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-urgency" />
                <div>
                  <div className="font-semibold">info@amarillocashhomebuyers.com</div>
                  <div className="text-sm text-primary-foreground/80">Email Us 24/7</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-urgency" />
                <div>
                  <div className="font-semibold">Serving Amarillo & Surrounding Areas</div>
                  <div className="text-sm text-primary-foreground/80">Your Local Home Buyers</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-urgency" />
                <div>
                  <div className="font-semibold">24/7 Availability</div>
                  <div className="text-sm text-primary-foreground/80">Always Here When You Need Us</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get Started Today</h4>
            <p className="text-primary-foreground/80">
              Ready to sell your house fast for cash? Get your free, no-obligation 
              offer in 24 hours.
            </p>
            
            <div className="space-y-3">
              <Button className="urgency-button w-full font-semibold py-3" onClick={() => document.getElementById('lead-form')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Get My Cash Offer
              </Button>
              
              <Button variant="outline" className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => window.open('tel:+18068039859')}>
                Call (806) 803-9859
              </Button>
            </div>
            
            <p className="text-xs text-primary-foreground/60">
              No obligation • No pressure • 100% confidential
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-primary-foreground/80">
              © 2024 Amarillo Cash Home Buyers. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/about" className="text-primary-foreground/80 hover:text-white transition-colors">
                About Us
              </a>
              <a href="/privacy-policy" className="text-primary-foreground/80 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-conditions" className="text-primary-foreground/80 hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="mailto:info@amarillocashhomebuyers.com" className="text-primary-foreground/80 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-primary-foreground/20">
            <p className="text-sm text-primary-foreground/60">
              We are professional real estate investors. We are not real estate agents. 
              We do not list houses. We buy houses directly from homeowners.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;