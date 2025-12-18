import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Profile() {
    const { isPending, error, data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/profile').then((res) => res.data),
        retry: false, // Don't retry on 401
    });

    if (isPending) return <div className="text-center py-10">Loading profile...</div>;

    if (error) return (
        <div className="text-center py-10 text-red-600">
            Error loading profile: {error.message}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application role.</p>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.data.name}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.data.email}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Roles</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {data.data.roles && data.data.roles.map(r => r.name).join(', ')}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Member since</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {new Date(data.data.created_at).toLocaleDateString()}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
