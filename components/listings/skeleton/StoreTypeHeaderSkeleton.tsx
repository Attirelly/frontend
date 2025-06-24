import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StoreTypeTabsSkeleton() {
  return (
    <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center">
          <Skeleton
            width={100}
            height={36}
            borderRadius={9999}
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
          />
          {index !== 2 && (
            <div className="h-6 border-r border-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
