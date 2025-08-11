"use client";

import React from 'react';
import { Truck, ShieldCheck, LifeBuoy, Smartphone } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="font-inter bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" aria-label="breadcrumb">
          <ol className="list-none flex space-x-2 p-0 m-0">
            <li>
              <a href="/" className="text-blue-600 hover:underline">Home</a>
            </li>
            <li>/</li>
            <li className="text-gray-500">About</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">About Attirelly</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Disrupting the offline unstructured fashion market by connecting customers to nearby fashion stores.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Search Engine: To Shop Offline
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You can search and discover nearby fashion stores at Attirelly. At an Attirelly STORE (a digital store of an offline store), you can check out the store’s information and outfit collection without physically going to the market. Now, there is no need to go from store to store to find the desired outfits within your budget and style.
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              E-Commerce: To Shop Online
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Find the latest and trending outfits, along with selling store names. You will be shown outfits from fashion stores that are under your selected location. This way, you are aware of your nearby fashion stores and can decide from which one to buy. At other e-commerce sites, you often don't know the sellers.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img 
              src="https://placehold.co/800x600/60a5fa/ffffff?text=About+Us"
              alt="About Attirelly"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="space-y-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900">Our Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900">Integrated eCommerce</h3>
              <p className="mt-2 text-gray-600">
                With our seller panel, you can also sell your products online. Why just remain local when you can reach out to the whole world and sell more.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900">Multiple Payment Options</h3>
              <p className="mt-2 text-gray-600">
                Your buyers may not pay through online banking, may not have e-wallets, or the shopper in your store might not have enough cash. We offer a wide range of payment options.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900">Secure Transactions</h3>
              <p className="mt-2 text-gray-600">
                All your transactions are secure and instant. When a buyer checks out, it will be through a 128-bit SSL encryption.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900">Shipping</h3>
              <p className="mt-2 text-gray-600">
                Now you can offer more shipping options to your buyers. They can purchase online and pick up directly from your store or we can ship it to them for you.
              </p>
            </div>
          </div>
        </div>

        {/* Need of Attirelly Section */}
        <div className="bg-gray-100 p-8 rounded-xl shadow-inner mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Need of Attirelly</h2>
          
          {/* Online Shopping Concerns */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Because of these following questions while buying online:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Will the product be original? A thought of it being fake?</li>
              <li>Are the listed outfits latest? As most other e-commerce platforms sell obsolete products.</li>
              <li>Uncertainty about the quality of fabric, size and fitting, and the outfit’s original color.</li>
            </ul>
            <h4 className="mt-6 font-semibold text-gray-800">Answers:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Attirelly shows you fashion stores that are located near you, so you may personally visit the stores to try out the outfit.</li>
              <li>You are aware of the authenticity of the nearby fashion stores. You can also check reviews and ratings.</li>
              <li>Find the latest and fresh collection of outfits in your budget and style along with selling store details.</li>
              <li>You can find the same outfit at other stores through Attirelly if the store you visited does not have your size.</li>
              <li>It is a fast delivery platform, with delivery within 2 days. In case of an urgent requirement, you may go to the store and buy from there.</li>
            </ul>
          </div>
          
          {/* Offline Shopping Concerns */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions in mind while buying offline?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Uncertainty about the store’s price range, variety, and quality of outfits.</li>
              <li>Uncertainty about the fashion store’s authenticity.</li>
              <li>Unaware of the ongoing sales, offers, and running discounts.</li>
            </ul>
            <h4 className="mt-6 font-semibold text-gray-800">Answers:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Make up your mind at home rather than visiting store-to-store, as Attirelly brings you nearby stores along with their latest outfit collections and details.</li>
              <li>Customers can check out details at home, like pricing range, sales, discounts, and product categories, before visiting.</li>
              <li>Attirelly makes its customers aware of the latest offers, sales, and discounts of nearby stores in advance.</li>
            </ul>
          </div>
        </div>

        {/* Icon-based Feature Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
            <Truck className="h-12 w-12 text-blue-500 mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900">100% Secure Payment</h3>
            <p className="mt-2 text-gray-600">Moving your card details to a much more secured place.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
            <ShieldCheck className="h-12 w-12 text-blue-500 mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900">Trustpay</h3>
            <p className="mt-2 text-gray-600">100% Payment Protection. Easy Return Policy.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
            <LifeBuoy className="h-12 w-12 text-blue-500 mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900">Help Center</h3>
            <p className="mt-2 text-gray-600">Got a question? Look no further. Browse our FAQs or submit your query here.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
            <Smartphone className="h-12 w-12 text-blue-500 mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900">Shop on the go</h3>
            <p className="mt-2 text-gray-600">Download the app and get exciting app-only offers at your fingertips.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutPage;
