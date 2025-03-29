import { Button } from "@/components/ui/button"
import { Youtube, Instagram, Phone } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" asChild>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <Youtube className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href="https://wa.me/2520633916396" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <Phone className="h-5 w-5" />
        </a>
      </Button>
    </div>
  )
}

