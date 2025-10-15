import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import sandraHeadshot from "@/assets/sandra-nesbitt.jpg";

const About = () => {
  const scrollToLeadForm = () => {
    window.location.href = "/#lead-form";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">About Us</h1>

        <section className="mb-12">
          <div className="mb-8">
            <div className="w-full max-w-md mx-auto">
              <img 
                src={sandraHeadshot} 
                alt="Sandra Nesbitt - Founder of Reddtrow Properties" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-primary mb-6">About Sandra Nesbitt</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              Sandra Nesbitt is the founder and owner of Reddtrow Properties, LLC. Born and raised in New York City, Sandra realized early on her passion for art and entrepreneurship. After graduating with a BFA in the late 1990s, Sandra was intent on someday being a Creative Director for an ad agency. However, while looking for full-time work in her profession, Sandra discovered real estate investing.
            </p>
            <p>
              Real estate investing has taught Sandra many valuable lessons about life that have become part of her business philosophy. One – perseverance, patience and prayer are important keys to success. Two – don't judge a book by its cover. You can always find something in common with anyone, no matter his or her walk through life. Three – "You can have everything in life you want, if you will just help enough other people get what they want" – Zig Ziglar.
            </p>
            <p>
              As the founder of Reddtrow Properties, LLC, Sandra's passion is to add value in regards to real estate. Her company strives to be different from other real estate investment companies. Reddtrow's services, resources and options are what sets them apart.
            </p>
            <p>
              We've been in business since 1999. Reddtrow began in the northeast part of the United States, and has been in the Dallas / Fort Worth area since 2007. We've closed on houses that had no hope. This is our mission: to provide homeowners with a fast, stress-free way to sell their house. We conduct all our transactions with honesty and integrity. Read our client testimonials to find out more about what the Reddtrow experience is like.
            </p>
            <p>
              Our real estate investment firm purchases single family properties in DFW and also Houston and Bryan / College Station Texas. We buy homes that are in poor condition for a number of reasons including homes that need repairs, homeowners who are behind on payments or facing foreclosure, fire or water damage, divorce, job transfer, problem with tenants, etc.
            </p>
            <p>
              When you sell your home to Reddtrow, we will pay all basic closing costs, purchase your house in as-is condition, and typically close 6-9 days after the title is cleared.
            </p>
            <p>
              Choose the real estate investment firm you can trust. Contact Reddtrow today.
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