import React, { useState, useEffect } from 'react';
import { UsersTable } from '@/src/components/Users/UsersTable';
import api from '@/src/services/api';
import { useToast } from '@/src/components/ui/Toast';

// Mock data generator for demo purposes
const generateMockUsers = () => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: Math.random().toString(36).substring(2, 15),
    phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    registrationDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    name: ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Williams', 'Michael Brown'][i % 5],
    email: `user${i}@example.com`,
    status: Math.random() > 0.2 ? 'active' : 'inactive' as const,
  }));
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // In a real app: const response = await api.get('/users');
        // setUsers(response.data);
        
        // Demo mock data
        setTimeout(() => {
          setUsers(generateMockUsers());
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        showToast('Failed to load users. Please try again.', 'error');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      // In a real app: await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast('Failed to delete user.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your application users and their permissions.</p>
      </div>
      <UsersTable users={users} onDelete={handleDeleteUser} isLoading={isLoading} />
    </div>
  );
};
