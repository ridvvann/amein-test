import { Badge } from "@/components/ui/badge"
import { PricingCard } from "@/components/pricing-card"

export default function PricingPage() {
  // Create WhatsApp links with pre-filled messages for each package
  const createWhatsAppLink = (package_name: string) => {
    const message = encodeURIComponent(
      `Hi Amein, I'm interested in your ${package_name} package. Can you provide more information?`,
    )
    return `https://wa.me/2520633916396?text=${message}`
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Services</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Choose the right package for your video production needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <PricingCard
          title="Basic"
          price="$499"
          description="Perfect for simple video projects"
          features={[
            { text: "Up to 2 minutes of final video", included: true },
            { text: "1 round of revisions", included: true },
            { text: "Basic color grading", included: true },
            { text: "Standard editing", included: true },
            { text: "Delivery in 1080p", included: true },
            { text: "Background music", included: true },
            { text: "Advanced VFX", included: false },
            { text: "Drone footage", included: false },
          ]}
          whatsappLink={createWhatsAppLink("Basic")}
        />

        <PricingCard
          title="Standard"
          price="$999"
          description="Great for promotional videos"
          features={[
            { text: "Up to 5 minutes of final video", included: true },
            { text: "2 rounds of revisions", included: true },
            { text: "Professional color grading", included: true },
            { text: "Advanced editing", included: true },
            { text: "Delivery in 4K", included: true },
            { text: "Licensed music", included: true },
            { text: "Basic VFX", included: true },
            { text: "Drone footage", included: false },
          ]}
          popular={true}
          whatsappLink={createWhatsAppLink("Standard")}
        />

        <PricingCard
          title="Premium"
          price="$1,999"
          description="For high-end commercial projects"
          features={[
            { text: "Up to 10 minutes of final video", included: true },
            { text: "Unlimited revisions", included: true },
            { text: "Advanced color grading", included: true },
            { text: "Premium editing", included: true },
            { text: "Delivery in 4K HDR", included: true },
            { text: "Custom music", included: true },
            { text: "Advanced VFX", included: true },
            { text: "Drone footage", included: true },
          ]}
          whatsappLink={createWhatsAppLink("Premium")}
        />

        <PricingCard
          title="Custom"
          price="Custom"
          description="Tailored to your specific needs"
          features={[
            { text: "Custom video length", included: true },
            { text: "Unlimited revisions", included: true },
            { text: "Custom color grading", included: true },
            { text: "Bespoke editing style", included: true },
            { text: "Multiple resolution options", included: true },
            { text: "Custom audio solution", included: true },
            { text: "Custom VFX requirements", included: true },
            { text: "Full production support", included: true },
          ]}
          whatsappLink={createWhatsAppLink("Custom")}
        />
      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Need Something Special?</h3>
        <p className="text-muted-foreground mb-6">
          Every project is unique. If you don't see a package that fits your needs, contact me for a personalized quote
          tailored to your specific requirements.
        </p>
        <div className="flex justify-center">
          <a
            href="https://wa.me/2520633916396"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact for Custom Quote
          </a>
        </div>
      </div>
    </div>
  )
}

