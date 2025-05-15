import axios from 'axios';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/axios';

export default async function SellerPage({ params }: { params: { id: string } }) {
  try {
     const res = await api.get(`/users/user?user_id=${params.id}`);
    const seller = res.data;

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Details</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="col-span-1 sm:col-span-2 flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
              {seller.profile_pic !== "string" ? (
                <Image
                  src={seller.profile_pic}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Data Fields */}
          <Field label="Name" value={seller.name} />
          <Field label="Email" value={seller.email} />
          <Field label="Role" value={seller.role} />
          <Field label="Gender" value={seller.gender} />
          <Field label="Location" value={seller.location} />
          <Field label="Contact Number" value={seller.contact_number} />
          <Field label="Meta UID" value={seller.meta_uid} />
          <Field label="Provider" value={seller.provider} />
          <Field label="Google UID" value={seller.google_uid} />
          <Field label="Birthday" value={seller.birthday} />
          <Field label="Created At" value={new Date(seller.created_at).toLocaleString()} />
          <Field label="Active" value={seller.active ? 'Yes' : 'No'} />
        </div>

        <div className="mt-8">
          <a
            href="/sellers"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Sellers
          </a>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.response?.status === 404) {
      return notFound();
    }

    return (
      <div className="text-center text-red-600 font-semibold p-10">
        Failed to load seller information.
      </div>
    );
  }
}

// Reusable component for each field
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="bg-gray-100 px-3 py-2 rounded text-gray-800 text-sm">{value || '-'}</div>
    </div>
  );
}
