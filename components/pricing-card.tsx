import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: PricingFeature[]
  popular?: boolean
  whatsappLink: string
}

export function PricingCard({ title, price, description, features, popular = false, whatsappLink }: PricingCardProps) {
  return (
    <Card className={`flex flex-col ${popular ? "border-primary shadow-lg" : ""}`}>
      {popular && (
        <div className="py-1 px-4 bg-primary text-primary-foreground text-xs font-medium text-center">Most Popular</div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Custom" && <span className="text-muted-foreground ml-1">/project</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check size={18} className={feature.included ? "text-primary" : "text-muted-foreground opacity-50"} />
              <span className={feature.included ? "" : "text-muted-foreground line-through opacity-50"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? "default" : "outline"} asChild>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            Get Started
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

