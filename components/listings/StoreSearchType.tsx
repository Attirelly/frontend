// components/StoreType.tsx
export default function StoreSearchType() {
  return (
    <div className="flex flex-col max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-gray-800 mb-4 mx-auto">
        Store Type
      </h1>

      <div className="grid grid-cols-2 space-y-4 gap-2">
        <div className="bg-[#F8F8F8] p-1 rounded-2xl text-center mb-0">
          <div className="text-gray-600 hover:text-gray-800 transition-colors">
            Designer Labels
          </div>
        </div>

        <div className="bg-[#F8F8F8] p-1 rounded-2xl text-center mb-0">
          <div className="text-gray-600 hover:text-gray-800 transition-colors">
            Retail Stores
          </div>
        </div>

        <div className="bg-[#F8F8F8] p-1 rounded-2xl text-center mb-0">
          <div className="text-gray-600 hover:text-gray-800 transition-colors">
            Rental Outfits
          </div>
        </div>

        <div className="bg-[#F8F8F8] p-1 rounded-2xl text-center mb-0">
          <div className="text-gray-600 hover:text-gray-800 transition-colors">
            Boutiques
          </div>
        </div>
        
      </div>
    </div>
  );
}
