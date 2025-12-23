import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Button from '../components/Button';
import styles from './Profile.module.scss';
import clsx from 'clsx';

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

    if (isPending) return <div className={styles.loading}>Loading profile...</div>;

    if (error) return (
        <div className={styles.error}>
            Error loading profile: {error.message}
        </div>
    );

    const user = data.data;

    const ProfileField = ({ label, name, value, type = "text", highlight = false }) => (
        <div className={clsx(styles.field, highlight && styles.alt)}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>
                {isEditing ? (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className={styles.input}
                    />
                ) : (
                    value || <span className={styles.italic}>Not set</span>
                )}
            </dd>
        </div>
    );

    return (
        <div className={styles.profileCard}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>User Profile</h3>
                    <p className={styles.subtitle}>Personal details and application role.</p>
                </div>
                <div className={styles.actions}>
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
            <div className={styles.content}>
                <dl>
                    <ProfileField label="Full name" name="name" value={formData.name} highlight />
                    <div className={styles.field}>
                        <dt className={styles.label}>Email address</dt>
                        <dd className={styles.value}>{user.email}</dd>
                    </div>
                    <ProfileField label="Telephone" name="tel" value={formData.tel} highlight />
                    <ProfileField label="Age" name="age" value={formData.age} type="number" />
                    <ProfileField label="Gender" name="gender" value={formData.gender} highlight />
                    <ProfileField label="Address" name="address" value={formData.address} />
                    <ProfileField label="City" name="city" value={formData.city} highlight />
                    <ProfileField label="Country" name="country" value={formData.country} />

                    <div className={clsx(styles.field, styles.alt)}>
                        <dt className={styles.label}>Roles</dt>
                        <dd className={styles.value}>
                            <div className={styles.rolesList}>
                                {user.roles && user.roles.map(r => (
                                    <span key={r.id} className={styles.rolePill}>
                                        {r.name}
                                    </span>
                                ))}
                            </div>
                        </dd>
                    </div>
                    <div className={styles.field}>
                        <dt className={styles.label}>Member since</dt>
                        <dd className={styles.value}>
                            {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
