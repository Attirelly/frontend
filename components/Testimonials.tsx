import React from "react";

interface Testimonial {
  name: string;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Aayushi R",
    review: "Attirely helped me scale fast. The onboarding was super easy...",
  },
  {
    name: "Vijay",
    review: "I never expected orders to come so quickly! Great platform.",
  },
  {
    name: "Sandeep M. Bichan",
    review: "The platform is easy to use and very helpful for new sellers.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 text-center">
      <h2 className="text-2xl font-bold mb-10">Brand success stories</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md">
            <p className="mb-4">{testimonial.review}</p>
            <div className="text-sm font-semibold">{testimonial.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
