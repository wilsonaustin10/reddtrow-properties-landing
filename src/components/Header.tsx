import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
const Header = () => {
  return <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <div className="h-20 w-32 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">Logo</span>
              </div>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-base">
              <div className="flex items-center space-x-1">
                <Phone className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">(555) 123-4567</span>
              </div>
            </div>
            
            <Button className="urgency-button font-semibold px-6 py-2 rounded-lg" onClick={() => document.getElementById('lead-form')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Get Cash Offer
            </Button>
          </div>
        </div>
        
        {/* Mobile contact info */}
        <div className="md:hidden flex flex-col items-center justify-center space-y-3 mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-primary" />
            <span className="font-bold text-xl">(555) 123-4567</span>
          </div>
          <Button className="urgency-button font-semibold px-8 py-3 rounded-lg text-base w-full max-w-xs" onClick={() => document.getElementById('lead-form')?.scrollIntoView({
            behavior: 'smooth'
          })}>
            Get Cash Offer
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;