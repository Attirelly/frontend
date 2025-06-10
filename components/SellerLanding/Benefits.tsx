import React from "react";

const benefits = [
  {
    title: "Attract new customers",
    description: "Reach thousands of people visiting Attirely",
  },
  {
    title: "Doorstep delivery",
    description: "Enjoy pickup and delivery services in selected cities",
  },
  {
    title: "Onboarding support",
    description: "Get personalized help during onboarding",
  },
];

const Benefits: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-white text-center">
      <h2 className="text-2xl font-bold mb-10">Why should you partner with Attirely?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="p-6 border rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">{benefit.title}</h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
