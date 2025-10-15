import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import teamPhoto from "@/assets/team-photo.jpg";

const About = () => {
  const scrollToLeadForm = () => {
    window.location.href = "/#lead-form";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">About Amarillo Cash Home Buyers</h1>

        <section className="mb-12">
          <div className="mb-8">
            <img 
              src={teamPhoto} 
              alt="Amarillo Cash Home Buyers Team" 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          <h2 className="text-3xl font-semibold text-primary mb-6">Our Team</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              We have been working with homeowners like yourself to sell your property with the right amount of speed and convenience so you have the least amount of issues. We give people fair cash offers and we purchase properties as is.
            </p>
            <p>
              We are a comprehensive business and will walk you through and manage the whole process at your pace so that selling your home is stress-free. We make the process as smooth as possible so you don't have to worry about it, let us worry for you!
            </p>
            <p>
              As experts, we will help you explore all the options available to you so you can make the decision that is best for you. We have your best interest in mind. Honesty, integrity and service are our core pillars.
            </p>
            <p>
              We're a local family business with a reputation you can trust. We work with a reputable title company who can attest that we do follow through! We look forward to working with you.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-primary/5 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-semibold text-primary mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Get your cash offer today – it's fast, easy, and completely obligation-free.
            </p>
            <Button 
              onClick={scrollToLeadForm}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Get Your Cash Offer Today
            </Button>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;