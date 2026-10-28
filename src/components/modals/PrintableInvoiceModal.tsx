import React from 'react';
import { Invoice } from '../../types';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const PrintableInvoiceModal: React.FC<Props> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6">
        {/* Actions bar (hidden during print) */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs font-bold text-slate-700">Hospital Billing Document</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 space-y-6 text-xs bg-white text-slate-900">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white font-bold flex items-center justify-center text-sm">
                  CP
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  CarePulse Regional Hospital
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                742 Medical Center Boulevard, Metro City, 90210
              </p>
              <p className="text-[11px] text-slate-500">
                Phone: +1 (555) 019-4800 · GSTIN: 27AABCC8921M1Z5
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-base font-extrabold text-slate-900 tracking-wider uppercase">
                Tax Invoice
              </h2>
              <div className="font-mono text-xs font-bold text-teal-700 mt-0.5">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Date: {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                  invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Billed To Patient
              </span>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{invoice.patientName}</div>
              <div className="font-mono text-xs text-teal-700 font-semibold">
                UHID: {invoice.patientUhid}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Payment Info
              </span>
              <div className="font-semibold text-slate-800 mt-0.5">
                {invoice.paymentMethod ? `Method: ${invoice.paymentMethod}` : 'Pending Payment'}
              </div>
              {invoice.transactionRef && (
                <div className="font-mono text-[11px] text-slate-500">
                  Ref: {invoice.transactionRef}
                </div>
              )}
              {invoice.insuranceClaim && (
                <div className="text-[10px] text-slate-500 mt-0.5">
                  TPA: {invoice.insuranceClaim.provider} ({invoice.insuranceClaim.approvalCode})
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-2.5 text-slate-800 font-semibold">{item.description}</td>
                    <td className="py-2.5 text-slate-500 text-[10px] font-mono">{item.category}</td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Hospital Discount:</span>
                  <span className="font-mono font-medium">-${invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Medical Tax / Cess (5%):</span>
                <span className="font-mono font-medium">${invoice.tax.toFixed(2)}</span>
              </div>
              {invoice.insuranceClaim && (
                <div className="flex justify-between text-blue-700 font-medium">
                  <span>Insurance TPA Covered:</span>
                  <span className="font-mono">-${invoice.insuranceClaim.claimedAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-300 text-sm font-extrabold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-teal-700 font-black">
                  ${invoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Compliance Footer */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-400">
            <div>
              <div className="flex items-center gap-1 text-slate-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Digitally Verified & Authorized by CarePulse Billing Desk</span>
              </div>
              <p className="mt-0.5">
                This is a computer-generated tax invoice. No physical signature required.
              </p>
            </div>
            <div className="text-right">
              <div className="w-40 border-b border-slate-400 mb-1"></div>
              <span>Authorized Officer Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
