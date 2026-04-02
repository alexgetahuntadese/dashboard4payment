import React, { useState, useMemo } from 'react';
import { Filter, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Download, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Button, Badge } from '@/src/components/ui/Common';
import { Modal } from '@/src/components/ui/Modal';
import { cn } from '@/src/lib/utils';
import { Payment } from '@/src/types';

interface PaymentsTableProps {
  payments: Payment[];
  onVerify?: (id: string, status: 'verified' | 'failed') => void;
  isLoading?: boolean;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, onVerify, isLoading }) => {
  const [statusFilter, setStatusFilter] = useState<Payment['status'] | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments];
    
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [payments, statusFilter, sortOrder]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPayments.slice(start, start + itemsPerPage);
  }, [filteredAndSortedPayments, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'verified': return <Badge variant="success">Verified</Badge>;
      case 'pending': return <Badge variant="warning">Pending Review</Badge>;
      case 'failed': return <Badge variant="error">Failed</Badge>;
    }
  };

  return (
    <Card className="flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['all', 'paid', 'pending', 'failed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-all capitalize',
                  statusFilter === status
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(p => p === 'asc' ? 'desc' : 'asc')}
            className="gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Date
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipt</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Phone</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (ETB)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div 
                      className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <img 
                        src={payment.receiptUrl} 
                        alt="Receipt" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">{payment.reference}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.userPhone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{payment.amount.toLocaleString()} ETB</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.method}</td>
                  <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.submittedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 h-auto text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {payment.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVerify?.(payment.id, 'verified')}
                            className="p-2 h-auto text-emerald-600 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVerify?.(payment.id, 'failed')}
                            className="p-2 h-auto text-rose-600 hover:bg-rose-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No payments found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium text-slate-900">
            {Math.min(currentPage * itemsPerPage, filteredAndSortedPayments.length)}
          </span>{' '}
          of <span className="font-medium text-slate-900">{filteredAndSortedPayments.length}</span> results
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

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Verification Details"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Amount (ETB)</p>
                <p className="text-2xl font-bold text-slate-900">{selectedPayment.amount.toLocaleString()} ETB</p>
              </div>
              {getStatusBadge(selectedPayment.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">User Phone</p>
                <p className="text-sm font-medium text-slate-900">{selectedPayment.userPhone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Bank Name</p>
                <p className="text-sm font-medium text-slate-900">{selectedPayment.bankName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Sender Number</p>
                <p className="text-sm font-medium text-slate-900">{selectedPayment.senderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Transaction Ref</p>
                <p className="text-sm font-mono text-slate-900">{selectedPayment.reference}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Payment Method</p>
                <p className="text-sm font-medium text-slate-900">{selectedPayment.method}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Submitted At</p>
                <p className="text-sm font-medium text-slate-900">{selectedPayment.submittedAt}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase font-semibold">Receipt Screenshot</p>
              <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                <img 
                  src={selectedPayment.receiptUrl} 
                  alt="Receipt" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <Button variant="secondary" size="sm" className="gap-2">
                     <Download className="w-4 h-4" />
                     View Full Size
                   </Button>
                </div>
              </div>
            </div>

            {selectedPayment.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    onVerify?.(selectedPayment.id, 'verified');
                    setSelectedPayment(null);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Unlock
                </Button>
                <Button 
                  variant="danger" 
                  className="flex-1 gap-2"
                  onClick={() => {
                    onVerify?.(selectedPayment.id, 'failed');
                    setSelectedPayment(null);
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};
