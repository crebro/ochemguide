import LivePreview from "@/components/livepreview";
import Image from "next/image";
import "@/app/livepreview.css"

export default function Home() {
  return (
    <div className="flex min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <LivePreview/>
      
    </div>
  );
}
