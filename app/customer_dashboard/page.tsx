'use client'
import Header from '@/components/Header';
// import {useRouter} from 'next/navigation';
import { logout } from '@/utils/logout';
import { api } from '@/lib/axios';
import ProtectedRouteComp from '@/components/ProtectedRouteComp';

export default function CustomerDashboard() {

    const handleApi = async () => {
        const payload = {
            "store_owner_id": "a0e6abe7-418e-4426-b436-264c103b2a87",
            "qr_id": "string",
            "store_name": "mister Bean",
            "store_address": "fa",
            "pincode": "dsa",
            "rental": true,
        }
        const res = await api.post('/stores/', payload);
        console.log(res.data);
    }

    return (
        <ProtectedRouteComp requiredRole="user">
            <div>
                {/* Header */}
                <Header
                    title="Attirelly"
                    actions={
                        <button
                            className="border border-gray-600 px-4 py-1 shadow-lg text-sm rounded hover:bg-blue-100"
                            onClick={() => logout('/customer_signin')}
                        >
                            Log out
                        </button>
                    }
                />
                <section>Hello Customer</section>
            </div>
        </ProtectedRouteComp>
    )

}