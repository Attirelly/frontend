import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="font-bold mb-2">Attirely</h3>
          <p className="text-sm text-gray-400">Contact · Terms · Privacy</p>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-sm">Follow us</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-300">FB</a>
            <a href="#" className="text-gray-300">IG</a>
            <a href="#" className="text-gray-300">TW</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
