'use client';
import React from 'react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useLandingStore } from '@/stores/useLandingStore';
import { Plus, Minus } from 'lucide-react';

const faqData = [
    { id: 1, q: "What is Attirelly?", a: "Fashion thrives on collaboration. Work with stylists, MUAs, photographers, wedding planners to create real projects, not just posts." },
    { id: 2, q: "Why should I use Attirelly?", a: "We focus on creating a collaborative ecosystem, providing direct brand deals, and helping you grow your professional network, not just earning referral fees." },
    { id: 3, q: "What makes Attirelly unique in the competitive industry?", a: "Our unique model connects you directly with brands and clients, saving you time and effort while maximizing your earning potential and professional growth." },
    { id: 4, q: "What are the operational hours of Attirelly?", a: "Our platform is available 24/7. Our partner support team is available from 10 AM to 7 PM IST, Monday to Saturday." },
    { id: 5, q: "What states are you currently operating in?", a: "We are a digital-first platform operating across India. We have a strong partner presence in major cities like Delhi, Mumbai, Bangalore, Jaipur, and more." },
];
const Faq = () => {
    const { openFaqId, toggleFaq } = useLandingStore();
    return (
        <SectionWrapper id="faq">
            <SectionTitle title="FAQ's" className="mb-12" />
            <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                        <div key={faq.id} className="border-b border-gray-200 pb-4">
                            <button onClick={() => toggleFaq(faq.id)} className="w-full flex justify-between items-center text-left text-xl font-semibold py-2">
                                <span>{faq.q}</span>
                                {isOpen ? <Minus className="flex-shrink-0"/> : <Plus className="flex-shrink-0"/>}
                            </button>
                            {isOpen && ( <div className="mt-2 text-gray-600 pr-8"><p>{faq.a}</p></div> )}
                        </div>
                    );
                })}
            </div>
        </SectionWrapper>
    );
};
export default Faq;