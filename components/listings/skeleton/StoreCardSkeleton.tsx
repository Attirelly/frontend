import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StoreCardSkeleton() {
  return (
    <div className="relative border border-[#F1F1F1] rounded-xl p-4 flex gap-4">
      <Skeleton
        width={640}
        height={240}
        // borderRadius={9999}
        baseColor="#e0e0e0"
        highlightColor="#f5f5f5"
      />
    </div>
  );
}
