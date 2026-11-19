import Section from "@/components/ui/Section";
import WorkCarousel from "./WorkCarousel";
import { CASE_STUDIES } from "@/data/work";

export default function Work() {
  return (
    <Section
      id="work"
      label="02 / work"
      title="Selected work"
      intro="Real projects from my job at Haddy Designs."
    >
      <WorkCarousel studies={CASE_STUDIES} />
    </Section>
  );
}
