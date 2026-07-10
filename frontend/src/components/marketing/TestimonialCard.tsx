import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Testimonial } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <div className="flex gap-0.5 text-gold-500">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</p>
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold">{testimonial.name}</p>
        {testimonial.role && <p className="text-xs text-muted">{testimonial.role}</p>}
      </div>
    </Card>
  );
}
