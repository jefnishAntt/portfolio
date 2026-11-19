"use client";
import Carousel from "@/components/ui/Carousel";
import Eyebrow from "@/components/ui/Eyebrow";
import { MetricList } from "@/components/ui/Metric";
import { BadgeList } from "@/components/ui/Badge";
import type { CaseStudy } from "@/data/work";

/** Case studies, one card at a time, using the shared Carousel. */
export default function WorkCarousel({ studies }: { studies: CaseStudy[] }) {
  return (
    <Carousel
      count={studies.length}
      label="Selected work"
      noun="case study"
      itemName={(i) => studies[i].title}
      renderSlide={(i) => {
        const study = studies[i];
        return (
          <>
            <Eyebrow>{study.context}</Eyebrow>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{study.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{study.challenge}</p>
            <MetricList items={study.metrics} className="mt-6" />
            <BadgeList items={study.stack} label="Tech stack" className="mt-6" />
          </>
        );
      }}
    />
  );
}
