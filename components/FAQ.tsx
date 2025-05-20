'use client'; // Important: mark as a Client Component

import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What are the documents and details required?",
    answer: "GST number, PAN, and a business bank account.",
  },
  {
    question: "How long will it take to go live?",
    answer: "Usually within 48 hours of document submission.",
  },
  {
    question: "Is there an onboarding fee?",
    answer: "No, it's completely free to register.",
  },
];

const FAQ: React.FC = () => {
  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently asked questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className="border-b pb-2">
                <Disclosure.Button className="flex justify-between w-full py-4 text-left font-medium text-gray-900">
                  <span>{faq.question}</span>
                  <ChevronUpIcon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pb-4 text-gray-600">
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
