export interface User {
  id: string;
  phone: string;
  registrationDate: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  isPremium: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  userPhone: string;
  amount: number; // in ETB
  bankName: string;
  senderNumber: string;
  reference: string;
  method: 'CBE' | 'TELEBIRR';
  status: 'pending' | 'verified' | 'failed';
  submittedAt: string;
  receiptUrl: string;
}
