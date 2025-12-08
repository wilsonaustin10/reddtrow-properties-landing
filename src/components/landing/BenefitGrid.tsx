import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  Home,
  Shield,
  Heart,
  FileText,
  Key,
  Truck,
  AlertTriangle,
  CheckCircle,
  Users,
  Calendar,
  Hammer,
  XCircle,
  Scale,
  Zap
} from "lucide-react";
import { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  clock: <Clock className="w-8 h-8 text-urgency" />,
  dollar: <DollarSign className="w-8 h-8 text-urgency" />,
  cash: <DollarSign className="w-8 h-8 text-urgency" />,
  home: <Home className="w-8 h-8 text-urgency" />,
  shield: <Shield className="w-8 h-8 text-urgency" />,
  heart: <Heart className="w-8 h-8 text-urgency" />,
  file: <FileText className="w-8 h-8 text-urgency" />,
  key: <Key className="w-8 h-8 text-urgency" />,
  truck: <Truck className="w-8 h-8 text-urgency" />,
  alert: <AlertTriangle className="w-8 h-8 text-urgency" />,
  check: <CheckCircle className="w-8 h-8 text-urgency" />,
  users: <Users className="w-8 h-8 text-urgency" />,
  calendar: <Calendar className="w-8 h-8 text-urgency" />,
  hammer: <Hammer className="w-8 h-8 text-urgency" />,
  x: <XCircle className="w-8 h-8 text-urgency" />,
  scale: <Scale className="w-8 h-8 text-urgency" />,
  zap: <Zap className="w-8 h-8 text-urgency" />,
};

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitGridProps {
  benefits: Benefit[];
  title?: string;
  subtitle?: string;
}

const BenefitGrid = ({
  benefits,
  title = "Why Choose Us?",
  subtitle = "We make selling your house fast and easy"
}: BenefitGridProps) => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {iconMap[benefit.icon] || iconMap.check}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitGrid;
