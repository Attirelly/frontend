import React from 'react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';

const stories = [
    { quote: "Got my first brand shoot with a Chandigarh label in 2 weeks — Attirelly made it easy!", author: "@riya.sharma11", details: "5k followers, college student" },
    { quote: "As a NIFT student, I worked on real campaigns and built my portfolio — total game changer!", author: "@creates.ritz", details: "12k followers, student Creator" },
    { quote: "Attirelly connected me with designers & stylists for city shoots. My collaborations grew faster than I imagined.", author: "@shivani.realistic", details: "45k followers, early professional" },
    { quote: "Being part of Attirelly’s campaigns gave me exposure & credibility — now brands approach me directly.", author: "@anaya_06", details: "150k followers, professional stylist & creator" },
];
const Testimonials = () => (
    <SectionWrapper>
        <SectionTitle title="Real Stories" className="mb-16" />
        <div className="grid md:grid-cols-2 gap-y-12 gap-x-8">
            {stories.map(s => (
                <div key={s.author} className="text-center">
                    <p className="text-lg italic text-gray-800">"{s.quote}"</p>
                    <p className="mt-4 font-semibold text-black">{s.author} <span className="text-gray-500 font-normal">({s.details})</span></p>
                </div>
            ))}
        </div>
    </SectionWrapper>
);
export default Testimonials;