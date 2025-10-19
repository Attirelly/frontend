import React from 'react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';

const CtaSection = () => (
  <SectionWrapper className="text-center" style={{ background: 'linear-gradient(to top, #f0f4ff, #ffffff)' }}>
    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Your Influence, Our Platform.</h2>
    <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
      join attirelly’s influencer network & start earning from your creativity today.
    </p>
    <div className="mt-8">
      <Button withArrow>Apply as an Influencer</Button>
    </div>
  </SectionWrapper>
);
export default CtaSection;