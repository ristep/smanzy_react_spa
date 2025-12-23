import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Button from '../components/Button';

export default function Profile() {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        tel: '',
        age: 0,
        address: '',
        city: '',
        country: '',
        gender: ''
    });

    const { isPending, error, data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/profile').then((res) => res.data),
        retry: false,
    });

    // Update formData when data is loaded
    useEffect(() => {
        if (data?.data) {
            setFormData({
                name: data.data.name || '',
                tel: data.data.tel || '',
                age: data.data.age || 0,
                address: data.data.address || '',
                city: data.data.city || '',
                country: data.data.country || '',
                gender: data.data.gender || ''
            });
        }
    }, [data]);

    const updateProfileMutation = useMutation({
        mutationFn: (updatedData) => {
            return api.put('/profile', updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            setIsEditing(false);
        },
        onError: (err) => {
            alert('Failed to update profile: ' + (err.response?.data?.error || err.message));
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = () => {
        updateProfileMutation.mutate(formData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to original
        if (data?.data) {
            setFormData({
                name: data.data.name || '',
                tel: data.data.tel || '',
                age: data.data.age || 0,
                address: data.data.address || '',
                city: data.data.city || '',
                country: data.data.country || '',
                gender: data.data.gender || ''
            });
        }
    };

    if (isPending) return <div className="text-center py-10 text-text-secondary">Loading profile...</div>;

    if (error) return (
        <div className="text-center py-10 text-red-600 dark:text-red-400">
            Error loading profile: {error.message}
        </div>
    );

    const user = data.data;

    const ProfileField = ({ label, name, value, type = "text" }) => (
        <div className="bg-background-secondary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-border last:border-0">
            <dt className="text-sm font-medium text-text-muted">{label}</dt>
            <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2">
                {isEditing ? (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="max-w-lg block w-full shadow-sm focus:ring-accent focus:border-accent sm:max-w-xs sm:text-sm border-input-border rounded-md py-2 px-3 border bg-input text-text-primary"
                    />
                ) : (
                    value || <span className="text-text-muted italic">Not set</span>
                )}
            </dd>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto bg-card shadow-xl overflow-hidden sm:rounded-xl border border-card-border my-8">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-background-secondary">
                <div>
                    <h3 className="text-xl leading-6 font-bold text-text-primary">User Profile</h3>
                    <p className="mt-1 max-w-2xl text-sm text-text-secondary">Personal details and application role.</p>
                </div>
                <div className="flex space-x-3">
                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={handleCancel}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={updateProfileMutation.isPending}
                            >
                                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="border-t border-border">
                <dl>
                    <ProfileField label="Full name" name="name" value={formData.name} />
                    <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-border">
                        <dt className="text-sm font-medium text-text-muted">Email address</dt>
                        <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2">{user.email}</dd>
                    </div>
                    <ProfileField label="Telephone" name="tel" value={formData.tel} />
                    <ProfileField label="Age" name="age" value={formData.age} type="number" />
                    <ProfileField label="Gender" name="gender" value={formData.gender} />
                    <ProfileField label="Address" name="address" value={formData.address} />
                    <ProfileField label="City" name="city" value={formData.city} />
                    <ProfileField label="Country" name="country" value={formData.country} />

                    <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-border">
                        <dt className="text-sm font-medium text-text-muted">Roles</dt>
                        <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2">
                            {user.roles && user.roles.map(r => (
                                <span key={r.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent mr-2 capitalize">
                                    {r.name}
                                </span>
                            ))}
                        </dd>
                    </div>
                    <div className="bg-background-secondary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-text-muted">Member since</dt>
                        <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2">
                            {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
