import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface SkillCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function SkillCard({ icon, title, description }: SkillCardProps) {
  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-full bg-primary/10">{icon}</div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

