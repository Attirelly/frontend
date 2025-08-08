'use client';

import React from "react";
import { Disclosure } from "@headlessui/react";
import { manrope } from "@/font";
import { FiPlus, FiMinus } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Attirelly?',
    answer: `Attirelly is building the next revolution in ethnic fashion—one city at a time.

We are a hyperlocal marketplace that connects India’s 500M+ fashion shoppers to 700K+ designer boutiques, tailors, and ethnic retail stores—from Chandni Chowk to Jaipur, Ludhiana to Surat.

Whether you’re a boutique in Banaras, a label in Mehrauli, or a tailor in Bhopal—Attirelly puts you online and in front of the right customers.`,
  },
  {
    question: 'What do I need to get started?',
    answer:
      'Just your store details and a few photos of your collection. We’ll take care of the rest—from digital setup to catalog assistance.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'We follow a performance-first model. You pay a small commission only when we generate sales for you. No upfront fees.',
  },
  {
    question: 'I don’t have a digital catalog. Can I still join?',
    answer:
      'Yes. Our team helps build your catalog from scratch—photos, pricing, and more.',
  },
  {
    question: 'What cities are you currently active in?',
    answer:
      'We are live in Delhi-NCR, Tricity, Ludhiana and are expanding rapidly.',
  },
];

const FAQ: React.FC = () => {
  return (
    <section className={`${manrope.className} flex flex-col items-center mt-20`}>
      <h2 className="text-[32px] text-[#1B1C57] mb-6 font-semibold">FAQ’s</h2>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className="bg-[#F7F9FC] p-4 rounded-md transition-all duration-300">
                <Disclosure.Button className="flex justify-between w-full items-center font-medium text-gray-900">
                  <span className="text-left text-[24px] text-[#1C1C1C]" style={{fontWeight:400}}>{faq.question}</span>
                  {open ? (
                    <FiMinus className="w-5 h-5 transition-transform duration-300 cursor-pointer" />
                  ) : (
                    <FiPlus className="w-5 h-5 transition-transform duration-300 cursor-pointer" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? 'max-h-[200px] mt-2' : 'max-h-0'
                  } text-[#535558] text-base`}
                  style={{fontWeight:400}}
                >
                  {faq.answer}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
