"use client";

import React from 'react';
import {
  ArrowRight,
  UserCheck,
  LayoutDashboard,
  Settings,
  Trash2,
  CheckCircle,
} from 'lucide-react';

const DataDeletionPage = () => {
  const steps = [
    {
      title: "Visit the Website",
      description: "Go to the seller sign-in page.",
      link: "https://attirelly.com/seller_signin",
      icon: ArrowRight,
    },
    {
      title: "Login to Account",
      description: "Login using your Seller credentials.",
      icon: UserCheck,
    },
    {
      title: "Navigate to Seller Dashboard",
      description: "After successful login, you will be taken to the seller Dashboard.",
      icon: LayoutDashboard,
    },
    {
      title: "Navigate to Socials Settings",
      description: "Click on “Socials” from the side panel.",
      icon: Settings,
    },
    {
      title: "Remove Instagram Account Integration and Related Data",
      description: "On the Socials Settings page, find the Instagram link field and click the Remove button next to it.",
      icon: Trash2,
    },
    {
      title: "Verify",
      description: (
        <>
          Ensure that the Instagram link field is now empty. To verify, check your Vendor Page on <a href="https://attirelly.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://attirelly.com/</a> and confirm no Instagram details are displayed.
        </>
      ),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-inter antialiased">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-10 lg:p-12">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Delete Your Instagram Data from Attirelly
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Follow these simple steps to remove your Instagram data and integration from your Attirelly seller account.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6">
            Steps to Follow
          </h2>
          <ol className="list-none space-y-8">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-100 shadow-sm">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-lg font-bold text-gray-800 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <step.icon className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Go to page
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default DataDeletionPage;
