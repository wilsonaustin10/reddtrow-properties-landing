import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Felisha H.",
      location: "Dallas, TX",
      quote: "Sandra is very attentive and a great person to work with in the process of selling a home. Reddtrow is an awesome company to work with they walk you through each step of the process and are very professional to work with."
    },
    {
      name: "Kerry B.",
      location: "Van Alstyne, TX",
      quote: "In late April of 2021, lightning struck our home.  The house caught fire and then suffered additional damage from the water used to put out the fire.  We were lucky (we and the cats lived, and many important possessions were recovered, and we had good insurance).  After a few weeks of talking to a contractor and dealing with the insurance company, we just didn't feel ready to restore the house, especially during a pandemic with supply shortages.  We decided to sell.  We met Sandra of Reddtrow Properties.  (We met with several other investors as well, but were most impressed with Sandra and her team.)  At a time of significant trauma, Sandra was professional, calm, friendly, true to her word, and led us through an amazingly easy process to closing.  She was also flexible with regard to timing (we needed to wait for a few open discussions to finish with the insurance company).  She chose a title company that came to our current home for the final paperwork.  From first contact to closing, we were impressed, and we would recommend Sandra and her group with enthusiasm."
    },
    {
      name: "Steve Pierce",
      location: "Dallas, TX",
      quote: "My family's experience with Reddtrow Properties, in particular Sandra Nesbitt, with the selling of our father's house at 8329 Van Pelt in Dallas could not have gone any smoother or been any simpler. Sandra is a low-key, very professional \"straight-shooter.\" She was the primary reason for our decision to go with Reddtrow Properties because whatever offers/contingencies she made about acquiring the property she stood by through the whole process. I would highly recommend Reddtrow if you're looking to sell your home \"as is.\""
    },
    {
      name: "Donald Teller",
      location: "Richardson, TX",
      quote: "Sandra – I thought you were very easy to work with. I hope you thought we were as well. The transaction was quick and easy. Can't ask for much more."
    },
    {
      name: "Tracy Hurndon",
      location: "Lancaster, TX",
      quote: "Hi Latona. First I would like to say thank you for all of your help throughout this process. I couldn't have asked for a better experience. I wasn't sure what to expect when I first called but you exceeded all of my expectations by far. You were always available for questions and kept an open line of communication at all times. Most importantly, I felt comfortable from the begging to the end, always feeling that you had all parties best interest in mind. Thanks again!"
    },
    {
      name: "Christopher G.",
      location: "Duncanville, TX",
      quote: "Chris and I want to thank you for all the hard work you did to make the deal go through. I definitely appreciate your services and if there's anything I can do to repay the favor to let me know."
    },
    {
      name: "Kimberly C.",
      location: "Waterbury, Connecticut",
      quote: "Dear Sandra, I wanted to take the time to say, Thank you from the bottom of my heart! You are a true miracle worker! I never thought it would be possible to save my house, but after telling you that was my intention, you truly kept my best interest in sight and did just that, You saved my house! I was amazed by your knowledge of this process, you made everything seem so easy, from dealing with the Loss Mitigator, to effortlessly handling all of the necessary paperwork. You kept me well informed, and even encouraged me through my doubt! You truly are a saint, Sandra, and your kindness will always be remembered."
    },
    {
      name: "Elijah H.",
      location: "New Haven, Connecticut",
      quote: "I was scheduled to retire at the end of 2004. I received Sandra's letter regarding purchasing my multi-family house. The house needed a lot of work. She made a fair offer and we closed in 42 days. I didn't have to deal with fussy Realtors and an unqualified buyer. Thank you Sandra for making this sale hassle-free!!!"
    },
    {
      name: "D. Branacci",
      location: "Waterbury, CT",
      quote: "Sandra sent me thorough and detailed package regarding Reddtrow Properties' Services for those with real estate problems. The solution she offered stopped my foreclosure and allowed me to KEEP my house. She saved my house when I thought all my options ran out. I was truly lucky to have Sandra working for me."
    },
    {
      name: "Henry H.",
      location: "Carrollton, Texas",
      quote: "We are very happy with you and your partner in the selling of my brother's home to your company. We were looking to move on quickly after a family tragedy of this magnitude and your reasonable offer, quick closing made it happened for us. I will not hesitate to recommend you to others. I can be your reference anytime. Thank you very much."
    },
    {
      name: "Judge Anthony Truglia Jr.",
      location: "Stamford, Connecticut",
      quote: "I am very pleased to be able to recommend my client and friend, Ms. Sandra Nesbitt, for any position requiring knowledge and experience in real estate management and investment. I have known Ms. Nesbitt for approximately 15 years, and have handled six real estate transactions for her. In each transaction I have been impressed with Ms. Nesbitt's understanding of real estate law and real estate management principles. I recommend her without reservation to fill positions of trust and authority in real estate management, marketing and investment."
    },
    {
      name: "Attorney Charlene Wright",
      location: "Shelton, Connecticut",
      quote: "I enjoy working with Sandra with real estate closings not only because she is a pleasure to work with, but all because she is knowledgeable in the area of real estate transactions. During my dealings with her, I found her to be highly intelligent, capable, and sincere. I think what strikes you the most when you deal with Sandra is that even though she is easy going – she is neither a push over nor a person who will say something because she thinks that is what you want to hear. Instead, she is direct, forthright, and professional."
    },
    {
      name: "John B.",
      location: "Dallas, Texas",
      quote: "Thank you Latonya for all your help. Thank you for understanding my situation with my health and my son. I honestly don't know what I would have done without you. You are a real gogetter for a woman. Ha! Thanks again little miss pretty one. Bless you."
    },
    {
      name: "Mark W.",
      location: "Rockwall, Texas",
      quote: "Working with Sandra and the staff at Reddtrow Properties was a smooth, low stress process in an otherwise very stressful event for our family. After narrowly escaping a significant fire in our home in the early morning hours of Palm Sunday morning, we endured weeks of trauma and uncertainty with the Insurance company, temporary housing, contents settlement, subrogation etc. Ultimately, we decided to sell the home with Sandra rather than endure the ongoing trauma of restoring a badly damaged home. We were made a very reasonable offer and Sandra/Team were very patient as it took almost 2 months for all the paperwork processes to clear, enabling us to close on the sale."
    },
    {
      name: "Brenda W.",
      location: "Balch Springs, Texas",
      quote: "Sandra, I just wanted to say thank you for making the sale of my house so quick and painless. I was concerned when we decided to sell that it would be a nightmare. However, I was surprisingly pleased at how quick and easy you made it, requiring at most maybe one hour of my time total. Thank you for being and doing what you said right from the start. I will recommend you to my friends and if the opportunity arises would be pleased to use your services again! Thank you again, Brenda."
    },
    {
      name: "Shellee H.",
      location: "Allen, Texas",
      quote: "Reddtrow's staff was very helpful in the process of buying my Mom's house after it caught fire. They were willing to work with me and answer all my questions."
    },
    {
      name: "Peter Arges",
      location: "Garland, Texas",
      quote: "Back in 2011, my mother past away from an illness at my home. I was grief stricken from my loss and didn't have any idea how to deal with her estate, especially her home. I have never been through this type of crisis in my life and without any family member to support me, I was going through a difficult time. One day in March of 2012, I happen to come upon a flyer from reddtrow properties in my mail box. I called the number on the flyer and spoke to Sandra Nesbitt. What a blessing! She and her company reps were professional, understanding, honest, and sincerely cared about me! It took some time for Sandra and her company to finalize the sale on my mother's house due to legal documents I had to record with the county. They were patient and they tried to help me in anyway to expedite my sale. Also the title company they work with is the best title company I have dealt with. They were professional, patient, knowledgeable, and help you in anyway. After all the paper work was in order and I finally closed at the title company, the funds were already there and I received my portion of the the funds right there in the title office. I also need to mention Leo Sanchez, one of the property buyers. He was professional, honest, punctual, and he truly seemed to care about his clients. He went out of his way in trying help me with my situation. I would call Sandra and Leo again in the future without any hesitation if I need their services again! I would highly recommend them if you want to deal with honest, sincere, professional, and knowledgeable buyer for you home! They are in my opinion, truly a blessing, in a difficult time!"
    },
    {
      name: "Walter L.",
      location: "Waxahachie, Texas",
      quote: "I appreciate all that you and your company had done for me. You were very professional as always and making sure your service focus on the business getting done. You taught me a lot and as I always say One is never too old to learn. Your company rescued me from a 10yr nightmare. Together with you and Mr.Sanchez, I am better and more informed. In my struggle, there was another company who was also trying to help me. I was committed to your company, and it was a good decision, because it was timely. Everything work out great! What I'm involved in now, requires your type of services, perhaps you will be available. Again,Thank You. SINCERELY."
    },
    {
      name: "Modesto Chinchilla",
      location: "The Colony, Texas",
      quote: "I appreciate very much that you and Leo were able to help me with the sale of my house in The Colony. You both were so profesional and prompt and took care of business quickly and completely. I thank you for your personal attention, including being at the title company to make sure that the deal was done correctly. In the future, if I need your expertise I will look you up again. Thank you very much."
    },
    {
      name: "Laverne W.",
      location: "Lancaster, Texas",
      quote: "Dear Sandra, I thank you for your assistance in helping me sale my rental property and for your patience having to endure all that we went through in order to close on the house. Your expertise and knowledge regarding real estate, and the resources you had on hand to delete every difficulty that arose. It was a pleasure to work with you and your team, and I am thankful for you that the property is no longer my responsibility."
    },
    {
      name: "Mike Richardson",
      location: "Flower Mound, TX",
      quote: "LaTona, I wanted to thank you again for all your support and help in the sell of my mother's house. I commend you on handling some of the issues that rose up towards the ending and how you got them resolved quickly. Please let your management and any prospects you may have know that I would personally highly recommend you. You have been great…"
    },
    {
      name: "Jan R.",
      location: "Richardson, Texas",
      quote: "When it came time to sell my parents home we decided we just wanted to sell it the quickest, easiest way. We called several individuals to get quotes on the property. After several quotes, there was no question we wanted to work with Sandra. She was professional, prompt, and we had the quote in hand by the next morning. Sandra came out to view our home on a Monday and we closed the next Friday, ten days later! It was a simple, easy and quick process. I would highly recommend dealing with Reddtrow Properties."
    },
    {
      name: "Jim Knox",
      location: "Chicago, Illinois",
      quote: "Sandra, as you know the house in Richardson, TX was in poor condition. An established Realtor told us that she would not represent us because of this poor condition. We had no one to oversee the renovation of the house. My daughter is recovering from a serious illness and I am a thousand miles away. Reddrow Properties observed the poor condition of the house and offered us an opportunity to sell the house AS IS with no additional cost. You did everything you said you would–a hassle free transaction in 30 days. Thank you. Without the stress of dealing with this house, my daughter can continue her recovery and I can continue to enjoy my retirement. I welcome the opportunity to share our good experience with you and Reddrow with anyone who could be helped as we were helped."
    },
    {
      name: "Robert Hand",
      location: "Grand Prairie, Texas",
      quote: "Latona you made this house thing easy for me. Could not ask for better! A pleasure doing business with you."
    },
    {
      name: "Chris R.",
      location: "Dallas, Texas",
      quote: "LaTona, Thanks for reaching out. The process went very well thanks to your effort. I can only remember 2 other times when everything hit on all cylinders. Thank you for a great job!!!"
    },
    {
      name: "Cathy N.",
      location: "Dallas, Texas",
      quote: "I was heir to a property with major title issues. I just wanted to sell for a fair price and work with a Real Estate Investor who works with a Title Company that can close on complex title issues. Sandra and her Title Co. in N. Dallas were able to see this through even when I almost gave up hope. Sandra bought the property and stood by during the long haul. Attorneys Title got the job done!!"
    },
    {
      name: "Tonya Shaw",
      location: "Grand Prairie, Texas",
      quote: "My husband and I had recently seperated and was headed toward divorce. We needed to sell the house fast because niether one could afford the payment alone. We wanted to avoid the legal issues in court regarding divorce and property. I called Sandra with Reddtrow Properties and she came out and walked us through the necessary steps to begin a short sale on our home. When the house was about to go into foreclosure, she continued to negotiate with the mortgage company until an agreement was reached that everyone could work with. Our house was sold in six months and I didn't have to do anything but sign some papers. Thanks Sandra!"
    },
    {
      name: "Sherry Ingram-Jones",
      location: "Sherry Jones Realty | Irving, Texas",
      quote: "It was my pleasure to deal with Sandra Nesbitt and Reddtrow Properties. As a Realtor, I find that Investors can often be difficult to deal with. They don't understand the Seller's position nor do they care. This was not the case with Reddtrow nor Sandra. I represented a Seller who had a burned out home. Sandra contacted us on behalf of Reddtrow Properties and the entire transaction went smoothly from start to finish. Reddtrow Properties knew exactly what they were doing and did exactly what they said they would do. Today's market can be scary for Sellers especially when they have unusual circumstances. I believe Reddtrow understands the Seller's position and work's with the Seller and/or their Agent to help eliminate the stress and anxiety that often accompanies the sale of their home. I look forward to working with them again in the future."
    },
    {
      name: "Anne G.",
      location: "Dallas, Texas",
      quote: "Latona and her team gave a new definition to the word professional. Their communication and follow-up was outstanding. Everything was done in a very timely manner. They had qualified investors viewing my house everyday. We had a bonafide cash offer in 2 weeks and it closed on time. Happy Thanksgiving!"
    },
    {
      name: "Maria Bodino",
      location: "Wylie, Texas",
      quote: "I purchased my first rehab house in May 2013 through Reddtrow Properties and worked with LaTona. LaTona was a pleasure to work with. She was always quick to respond and was willing to answer all my questions. The process was quick and simply. We closed on time without any issues. I will definitely buy another house through Reddtrow Properties."
    },
    {
      name: "Irena K.",
      location: "Plano, Texas",
      quote: "We too appreciated your professional approach with friendly and timely responses. The task of selling our Mother's house was not easy for us; however, working with you was very positive and made the task easier for us."
    },
    {
      name: "Karen U.",
      location: "Irving, Texas",
      quote: "I am so glad Sandra Nesbitt and Reddtrow Properties sent a letter explaining how we had another option of selling our house \"as is\" after our fire, instead of dealing with contractors and the mortgage company to rebuild. It was amazingly easy working with Sandra. She is knowledgeable and experienced and is quick to respond to questions and phone calls. We closed within three weeks of signing the contract. I highly recommend Sandra and Reddtrow Properties!"
    },
    {
      name: "Keesha & Roderick Moore",
      location: "Desoto, Texas",
      quote: "We would like to say that Sandra has really helped us out in getting our house sold as a short sell. She is a hard worker, patient and she ACTUALLY gets the deals done!!! I would recommend her to anyone who is in need of help with any real estate deal (wholesale, short sale, etc.) THANK YOU SANDRA FOR ALL YOUR HARD WORK!!!!"
    },
    {
      name: "Lorain F.",
      location: "Dallas, Texas",
      quote: "Dear Ms. Nesbitt, I would like to take this opportunity to thank you for professionalism in handling the sale of my home. You made the transaction a pleasant experience. Thank you for taking this house off my hands. You don't know what a relief it is."
    },
    {
      name: "Zoe M.",
      location: "Plano, Texas",
      quote: "On April 13, 2010 our home was destroyed by an electrical fire. At first we were overwhelmed by all of the restoration companies, contractors and insurance loopholes. Once we decided that selling our property was an option and began working with Reddtrow Properties, life became so much easier. They were very patient and fair and helped us through the process every step of the way. They even assisted us when we were having issues with our mortgage company. Working with Reddtrow was a great experience and I would highly recommend them to anyone. If every cloud has a silver lining Reddtrow Properties was ours!"
    },
    {
      name: "Zita D.",
      location: "Bristol, Connecticut",
      quote: "As I write this letter with honor, the amazing job as well as performance on what Sandra has done for me and three girls. December 6th 2006, I could not have been scrambling around more than I did on that day. Once again as I procrastinate, finding Sandra was a blessing. She saved my house with a deadline of the 11th of December. The final decision was made on the 15th and needless to say I have my \"HOME\". I with all of his done, with the faxes and the phone calls on top of the amazing patience that Sandra has especially dealing with a high anxiety person as myself. It all worked out. The best business is by word of mouth my word of mouth could not peak highly or loudly enough about Ms. Nesbitt. Sandra, Thank you, Thank you, Thank you."
    },
    {
      name: "Linda F.",
      location: "Dallas, Texas",
      quote: "The loss of my brother in the winter of 2008 was very painful. I was left with the burden of dealing with his house in Probate. The entire process was a roller coaster. From the time we met Sandra, it took exactly 1 year to settle and finally close on the house. Sandra and her team were very resourceful and patient throughout this ordeal. I feel we have gained something from this experience. I am SO happy the entire family can move on."
    },
    {
      name: "Tim W.",
      location: "Arlington, Texas",
      quote: "The sales process was handled in a very fast and professional manner. During the difficult time following the loss of our house due to a fire, it was nice to have something go easily."
    },
    {
      name: "Vickie G.",
      location: "Dallas, Texas",
      quote: "My son was leaving for the ARMY in 4 days when he accepted Reddtrow Properties' all cash offer. Thanks to Sandra and her team, the house was sold in his absence. Sandra and the Escrow Agent did a fantastic job in straightening out title issues and getting the house closed. My son was so pleased to have Reddtrow Properties help his wife in his absence. Thank you for a job well done. I would recommend you to all my friends and family. You have become a household name among our family."
    },
    {
      name: "Destiny E.",
      location: "Fort Worth, Texas",
      quote: "Everything went very smoothly. You answered every question, text and phone. I will admit I was afraid. However, you made me feel better. I really appreciate your help."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold text-primary mb-4">
                Reddtrow Testimonials
              </h1>
              <p className="text-2xl text-muted-foreground mb-6">
                Meet our happy home sellers!
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold">Excellent Reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="trust-card h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="text-muted-foreground mb-4 italic leading-relaxed flex-grow">
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
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;