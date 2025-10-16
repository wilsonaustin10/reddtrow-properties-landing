import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
const Testimonials = () => {
  const testimonials = [{
    name: "Sheila Pace",
    situation: "Inherited Property",
    quote: "JW was very helpful getting my Mother's house sold after she passed. He was a real pleasure to work with and made the process go very smoothly. Highly recommend him if you need to sell a house quickly and efficiently.",
    rating: 5
  }, {
    name: "Melissa Moon-Henson",
    situation: "Family Home Sale",
    quote: "Highly recommend JW. We worked with him when selling the home that only our family resided in for 70+ years. JW was very professional, patient with all our questions and got us to closing very quickly.",
    rating: 5
  }, {
    name: "Michelle McCool",
    situation: "Loss in Family",
    quote: "JW was a saving grace to my husband and I. We sold our home to him and it was a positive and easy experience even after the loss of my brother when we had no strength left for renovations. He made it very easy, fair and timely. I would highly recommend him to anyone. Thank you JW!",
    rating: 5
  }, {
    name: "Cassie Jackson",
    situation: "Quick Sale",
    quote: "JW made the process of selling our home so easy. From the original walkthrough to closing, it was on our timeline with very little effort from us. Definitely recommend!",
    rating: 5
  }, {
    name: "James Heartquist",
    situation: "Problematic Tenants",
    quote: "I had a positive experience working with JDub Buys Houses. They presented a fair offer when I needed to address issues with problematic tenants. I'm very satisfied with the overall process. Their professionalism is commendable, and I highly recommend their services.",
    rating: 5
  }, {
    name: "Bob Cowan",
    situation: "Professional Service",
    quote: "My experience with J W has been extremely professional in every way. From the beginning it was clear that this is a person of integrity and strong values who is primarily interested in helping his clients. At every step he made every effort to answer all my questions and make sure I was comfortable. I have the utmost trust and confidence in his work.",
    rating: 5
  }, {
    name: "Erica O.",
    situation: "Relocation",
    quote: "Working with J was the best decision we made in this relocation process. I would do it again in a heartbeat. They worked with us through the entire process and made sure we were comfortable with everything. There was no pressure or sells tactics. Fully recommend to take the ease of moving off your plates.",
    rating: 5
  }, {
    name: "Nelda Patterson",
    situation: "Fair Offer",
    quote: "I sold a property to JDub Buys Houses. It was an extremely great experience. I was treated very fairly. I was very impressed with how I was treated. The offer was fair and the person I dealt with was very helpful and understanding. I would definitely deal with them again if I had a need to sell property again.",
    rating: 5
  }];
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => <Card key={index} className="trust-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-sm font-semibold text-success">
                    {testimonial.situation}
                  </span>
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-primary">
                    {testimonial.name}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
        
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