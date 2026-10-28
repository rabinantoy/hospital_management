import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Invoice, InvoiceItem } from '../types';
import {
  Receipt,
  Printer,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  FileText
} from 'lucide-react';

interface Props {
  onOpenInvoiceModal: (invoice: Invoice) => void;
  onOpenPaymentModal: (invoice: Invoice) => void;
}

export const BillingView: React.FC<Props> = ({
  onOpenInvoiceModal,
  onOpenPaymentModal
}) => {
  const {
    invoices,
    patients,
    createInvoice
  } = useHospital();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  // New Invoice Form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [items, setItems] = useState<Array<{ description: string; category: InvoiceItem['category']; quantity: number; unitPrice: number }>>([
    { description: 'Specialist Physician Consultation Fee', category: 'CONSULTATION', quantity: 1, unitPrice: 120.00 }
  ]);
  const [discount, setDiscount] = useState<number>(0);

  const filtered = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientUhid.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalOutstanding = invoices
    .filter(i => i.status === 'PENDING')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { description: 'Routine Diagnostic Test Fee', category: 'LAB', quantity: 1, unitPrice: 45.00 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    if (!patient || items.length === 0) return;

    const invoiceItems: InvoiceItem[] = items.map((item, idx) => ({
      id: `inv-item-${Date.now()}-${idx}`,
      description: item.description,
      category: item.category,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Number(item.quantity) * Number(item.unitPrice)
    }));

    const subtotal = invoiceItems.reduce((sum, i) => sum + i.total, 0);
    const tax = Number((subtotal * 0.05).toFixed(2));
    const totalAmount = Math.max(0, subtotal + tax - Number(discount));

    createInvoice({
      patientId: patient.id,
      patientName: patient.fullName,
      patientUhid: patient.uhid,
      items: invoiceItems,
      subtotal,
      discount: Number(discount),
      tax,
      totalAmount,
      status: 'PENDING'
    });

    setShowCreateInvoice(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Hospital Accounts & Billing Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Itemized invoices for consultations, inpatient beds, labs, and pharmacy dispensing
          </p>
        </div>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Itemized Bill</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 block">Total Invoices Issued</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {invoices.length}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">Settled Payments</span>
          <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
            ${totalCollected.toFixed(2)}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">Outstanding Balance</span>
          <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400 mt-1 block">
            ${totalOutstanding.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice #, patient name, or UHID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Invoice #</th>
                <th className="py-2.5">Billed Patient</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Items</th>
                <th className="py-2.5 text-right">Subtotal</th>
                <th className="py-2.5 text-right">Total Amount</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filtered.map(inv => {
                const isPaid = inv.status === 'PAID';
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 font-sans">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{inv.patientName}</div>
                      <div className="font-mono text-[10px] text-teal-600 font-semibold">{inv.patientUhid}</div>
                    </td>
                    <td className="py-3 text-slate-500 font-sans text-[11px]">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 text-center font-sans">
                      {inv.items.length} items
                    </td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                      ${inv.subtotal.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-black text-slate-900 dark:text-slate-100 text-sm">
                      ${inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenInvoiceModal(inv)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3 text-teal-600" />
                          <span>Print Bill</span>
                        </button>
                        {!isPaid && (
                          <button
                            onClick={() => onOpenPaymentModal(inv)}
                            className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Generator Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-600" />
                <span>Create Hospital Invoice</span>
              </h3>
              <button
                onClick={() => setShowCreateInvoice(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Billed Patient *
                </label>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.uhid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[11px] text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    Itemized Charges
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-teal-600 hover:underline font-bold text-xs"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.category}
                          onChange={e => handleItemChange(idx, 'category', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                        >
                          <option value="CONSULTATION">Consultation</option>
                          <option value="LAB">Lab Test</option>
                          <option value="PHARMACY">Pharmacy</option>
                          <option value="BED">Bed / Room</option>
                          <option value="PROCEDURE">Procedure</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono text-center"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={e => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono text-right"
                        />
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital Discount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={e => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoice(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
