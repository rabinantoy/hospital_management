import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Invoice } from '../../types';
import { X, CreditCard, Banknote, QrCode, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, invoice }) => {
  const { recordPayment } = useHospital();

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'INSURANCE'>('CARD');
  const [refNumber, setRefNumber] = useState(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment(invoice.id, paymentMethod, refNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Process Bill Payment
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Invoice {invoice.invoiceNumber} · {invoice.patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Amount Due Card */}
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase">
                Payable Balance
              </span>
              <div className="text-xl font-extrabold font-mono text-teal-900 dark:text-teal-100">
                ${invoice.totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
              <span>Items: {invoice.items.length}</span>
              <br />
              <span className="font-mono text-teal-600">Tax incl. 5%</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Settlement Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'UPI', label: 'UPI / Instant QR', icon: QrCode },
                { id: 'CASH', label: 'Cash at Counter', icon: Banknote },
                { id: 'INSURANCE', label: 'Insurance Direct TPA', icon: Shield }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transaction / Authorization Reference *
            </label>
            <input
              type="text"
              required
              value={refNumber}
              onChange={e => setRefNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors"
            >
              Confirm & Post Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
