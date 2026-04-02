import React, { useState, useMemo } from 'react';
import { Search, Trash2, Eye, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { Card, Button, Input } from '@/src/components/ui/Common';
import { Modal } from '@/src/components/ui/Modal';
import { useToast } from '@/src/components/ui/Toast';
import { cn } from '@/src/lib/utils';

interface User {
  id: string;
  phone: string;
  registrationDate: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

interface UsersTableProps {
  users: User[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { showToast } = useToast();
  const itemsPerPage = 5;

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(id);
      showToast('User deleted successfully', 'success');
    }
  };

  return (
    <Card className="flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">User Management</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reg. Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">#{user.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.registrationDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="p-2 h-auto text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="p-2 h-auto text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium text-slate-900">
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
          </span>{' '}
          of <span className="font-medium text-slate-900">{filteredUsers.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 h-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 h-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{selectedUser.name}</h4>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold">Phone</p>
                <p className="text-sm font-medium text-slate-900">{selectedUser.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase font-semibold">Access Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("w-2 h-2 rounded-full", selectedUser.isPremium ? "bg-emerald-500" : "bg-slate-300")} />
                  <p className="text-sm font-medium text-slate-900">{selectedUser.isPremium ? 'Premium' : 'Free'}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Registration Date</p>
                <p className="text-sm font-medium text-slate-900">{selectedUser.registrationDate}</p>
              </div>
            </div>

            {selectedUser.isPremium && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Latest Verified Receipt</p>
                <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img 
                    src={`https://picsum.photos/seed/${selectedUser.id}/800/400`} 
                    alt="Latest Receipt" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};
