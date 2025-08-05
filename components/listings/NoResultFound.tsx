import Image from "next/image";

export default function NoResultFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src="/ListingPageHeader/empty_cupboard.svg"
        alt="No Results Found"
        width={315}
        height={327}
        className="mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Results Found</h2>
      <p className="text-base text-gray-600">Try adjusting your search or filter options.</p>
    </div>
  );
}