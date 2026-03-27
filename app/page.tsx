import CopilotHero from "@/app/components/CopilotHero";
import VideoRow from "@/app/components/VideoRow";
import { categories, getVideosByCategory } from "@/app/lib/data";

export default function Home() {
  return (
    <div>
      <CopilotHero />
      <div className="space-y-4 pb-8 mt-12">
        {categories.map((category) => (
          <VideoRow
            key={category}
            title={category}
            videos={getVideosByCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}
