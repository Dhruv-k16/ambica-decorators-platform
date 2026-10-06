"use client";
"use client";
import Navbar from '@/components/public/Navbar';
import Portfolio from '@/components/public/Portfolio';

export default function PortfolioPage() {
  return (
    <>
      <Navbar onEnquire={() => {}} />

      <main>
        <Portfolio fullGallery />
      </main>
    </>
  );
}
