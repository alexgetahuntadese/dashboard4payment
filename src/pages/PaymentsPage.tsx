import React, { useState, useEffect } from 'react';
import { PaymentsTable } from '@/src/components/Payments/PaymentsTable';
import api from '@/src/services/api';
import { useToast } from '@/src/components/ui/Toast';
import { Payment } from '@/src/types';

const generateMockPayments = (): Payment[] => {
  return Array.from({ length: 25 }).map((_, i) => ({
    id: Math.random().toString(36).substring(2, 15),
    userId: `user_${i}`,
    userPhone: `+251 9${Math.floor(10 + Math.random() * 90)}${Math.floor(100000 + Math.random() * 900000)}`,
    amount: [100, 250, 500, 1000][Math.floor(Math.random() * 4)],
    bankName: ['Commercial Bank of Ethiopia', 'Telebirr', 'Abyssinia Bank'][Math.floor(Math.random() * 3)],
    senderNumber: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    reference: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    method: Math.random() > 0.5 ? 'CBE' : 'TELEBIRR',
    status: ['pending', 'verified', 'failed'][Math.floor(Math.random() * 3)] as any,
    submittedAt: new Date(Date.now() - Math.random() * 1000000000).toLocaleString(),
    receiptUrl: `https://picsum.photos/seed/${i}/800/1200`,
  }));
};

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        // In a real app: const response = await api.get('/payments');
        // setPayments(response.data);
        
        // Demo mock data
        setTimeout(() => {
          setPayments(generateMockPayments());
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
        showToast('Failed to load payments.', 'error');
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleVerify = async (id: string, status: 'verified' | 'failed') => {
    try {
      // In a real app: await api.patch(`/payments/${id}`, { status });
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      showToast(`Payment ${status === 'verified' ? 'verified' : 'rejected'} successfully.`, 'success');
    } catch (error) {
      showToast('Failed to update payment status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Verification</h1>
        <p className="text-slate-500 text-sm mt-1">Review and verify user payment receipts to unlock premium access.</p>
      </div>
      <PaymentsTable payments={payments} onVerify={handleVerify} isLoading={isLoading} />
    </div>
  );
};
