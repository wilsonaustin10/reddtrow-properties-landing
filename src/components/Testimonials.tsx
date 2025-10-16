import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const Testimonials = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  const testimonials = [
    {
      name: "Felisha H.",
      location: "Dallas, TX",
      quote: "Sandra is very attentive and a great person to work with in the process of selling a home. Reddtrow is an awesome company to work with they walk you through each step of the process and are very professional to work with."
    },
    {
      name: "Kerry B.",
      location: "Van Alstyne, TX",
      quote: "At a time of significant trauma, Sandra was professional, calm, friendly, true to her word, and led us through an amazingly easy process to closing. From first contact to closing, we were impressed, and we would recommend Sandra and her group with enthusiasm."
    },
    {
      name: "Steve Pierce",
      location: "Dallas, TX",
      quote: "My family's experience with Reddtrow Properties, in particular Sandra Nesbitt, could not have gone any smoother or been any simpler. Sandra is a low-key, very professional \"straight-shooter.\" I would highly recommend Reddtrow if you're looking to sell your home \"as is.\""
    },
    {
      name: "Tracy Hurndon",
      location: "Lancaster, TX",
      quote: "I couldn't have asked for a better experience. You were always available for questions and kept an open line of communication at all times. Most importantly, I felt comfortable from the begging to the end."
    },
    {
      name: "Kimberly C.",
      location: "Waterbury, Connecticut",
      quote: "I wanted to take the time to say, Thank you from the bottom of my heart! You are a true miracle worker! You saved my house! I was amazed by your knowledge of this process, you made everything seem so easy."
    },
    {
      name: "Mark W.",
      location: "Rockwall, Texas",
      quote: "Working with Sandra and the staff at Reddtrow Properties was a smooth, low stress process in an otherwise very stressful event for our family. We were made a very reasonable offer and Sandra/Team were very patient."
    },
    {
      name: "Peter Arges",
      location: "Garland, Texas",
      quote: "Sandra and her company reps were professional, understanding, honest, and sincerely cared about me! They were patient and they tried to help me in anyway. I would highly recommend them if you want to deal with honest, sincere, professional, and knowledgeable buyer for you home!"
    },
    {
      name: "Jan R.",
      location: "Richardson, Texas",
      quote: "Sandra was professional, prompt, and we had the quote in hand by the next morning. Sandra came out to view our home on a Monday and we closed the next Friday, ten days later! It was a simple, easy and quick process."
    },
    {
      name: "Karen U.",
      location: "Irving, Texas",
      quote: "I am so glad Sandra Nesbitt and Reddtrow Properties sent a letter explaining how we had another option of selling our house \"as is\" after our fire. She is knowledgeable and experienced and is quick to respond. We closed within three weeks. I highly recommend Sandra and Reddtrow Properties!"
    },
    {
      name: "Anne G.",
      location: "Dallas, Texas",
      quote: "Latona and her team gave a new definition to the word professional. Their communication and follow-up was outstanding. Everything was done in a very timely manner. We had a bonafide cash offer in 2 weeks and it closed on time."
    }
  ];
  
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Don't just take our word for it - hear how we can help
          </p>
          <div className="flex items-center justify-center mt-6 space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
            </div>
            <span className="text-lg font-semibold">4.9/5 Average Rating</span>
            <span className="text-muted-foreground">(Excellent Reviews)</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
            Real reviews from real customers on Google.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="trust-card h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 mb-4 italic leading-relaxed flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="border-t pt-4 mt-auto">
                      <div className="font-semibold text-primary">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        
        <div className="text-center mt-12">
          <div className="bg-primary/5 p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Join Our Happy Homeowners
            </h3>
            <p className="text-muted-foreground mb-6">
              We've helped countless families in all situations sell their homes quickly and move on with their lives.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-primary">Everyday</div>
                <div className="text-sm text-muted-foreground">We Buy Houses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">Millions</div>
                <div className="text-sm text-muted-foreground">Paid to Homeowners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">26+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
            <a 
              href="/testimonials" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Read All Testimonials
            </a>
          </div>
        </div>
      </div>
    </section>;
};
export default Testimonials;