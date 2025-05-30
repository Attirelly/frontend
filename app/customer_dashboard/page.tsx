'use client'
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
// import {useRouter} from 'next/navigation';
import { logout } from '@/utils/logout';

export default function CustomerDashboard() {
    return (
        <ProtectedRoute role="customer">
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
            HI
        </div>
        </ProtectedRoute>
    )

}