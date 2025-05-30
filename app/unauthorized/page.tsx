'use client'
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <button className='border border-gray-300 w-25 h-8 bg-gray-100 rounded-2xl transition hover:bg-gray-300 hover:text-white' 
      onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
}