import Link from "next/link"
import { SocialLinks } from "@/components/social-links"

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold">AM</div>

          <nav className="flex gap-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/portfolio" className="hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          <SocialLinks />
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Amein Mouse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

