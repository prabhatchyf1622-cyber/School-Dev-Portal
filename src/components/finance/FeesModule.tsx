import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { calculateFeeSummary } from '../../utils/academicCalculations';
import {
  DollarSign,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Check,
  Building,
  GraduationCap,
} from 'lucide-react';
import { FeeRecord } from '../../types';

export const FeesModule: React.FC = () => {
  const { currentUser, fees, payFee, selectedChild, allUsers } = useSchool();

  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [payingFee, setPayingFee] = useState<FeeRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [viewingReceipt, setViewingReceipt] = useState<FeeRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Student filter
  const targetStudent = currentUser.role === 'student' ? currentUser : selectedChild || allUsers[0];
  const relevantFees = currentUser.role === 'admin'
    ? fees
    : fees.filter(f => f.studentId === targetStudent.id);

  const filteredFees = relevantFees.filter(f => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'paid') return f.status === 'paid';
    return f.status !== 'paid';
  });

  const summary = calculateFeeSummary(relevantFees);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFee) return;

    const updated = payFee(payingFee.id, paymentMethod);
    setPayingFee(null);
    if (updated) {
      setViewingReceipt(updated);
      showToast(`Payment of ₹${updated.amount.toLocaleString()} received successfully!`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Fees & Financial Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            School tuition, laboratory charges, payment gateways, and official tax receipts.
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Invoices
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterStatus === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Pending Dues ({summary.pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterStatus === 'paid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Paid Records
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Total Invoiced
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ₹{summary.totalAmount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Academic Year 2026-27</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Paid & Settled
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            ₹{summary.totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-semibold">100% verified transactions</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Pending Outstanding
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
            ₹{summary.totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-rose-600 mt-1 font-medium">
            {summary.pendingCount > 0 ? `${summary.pendingCount} invoice(s) pending clearance` : 'Nil balance'}
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Fee Breakdown & Invoices {currentUser.role !== 'admin' && `· ${targetStudent.name}`}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {filteredFees.length} invoice(s)
          </span>
        </div>

        <div className="space-y-4">
          {filteredFees.map(fee => (
            <div
              key={fee.id}
              className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                    {fee.invoiceNo}
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    fee.status === 'paid' ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {fee.status}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-xs text-slate-500">· {fee.studentName} (Class {fee.classId})</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{fee.term}</h3>

                <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tuition:</span>
                    <span className="font-mono font-medium">₹{fee.breakdown.tuitionFee.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Science Lab:</span>
                    <span className="font-mono font-medium">₹{fee.breakdown.labFee.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Transport:</span>
                    <span className="font-mono font-medium">₹{fee.breakdown.transportFee.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Library:</span>
                    <span className="font-mono font-medium">₹{fee.breakdown.libraryFee.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sports & Co-Curr:</span>
                    <span className="font-mono font-medium">₹{fee.breakdown.activityFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                <div className="text-left md:text-right">
                  <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    ₹{fee.amount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {fee.status === 'paid' ? `Paid on ${fee.paidDate}` : `Due: ${fee.dueDate}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {fee.status === 'paid' ? (
                    <button
                      onClick={() => setViewingReceipt(fee)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      View Receipt
                    </button>
                  ) : (
                    <button
                      onClick={() => setPayingFee(fee)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay Online
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Payment Modal */}
      {payingFee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">SchoolDev Payment Gateway</h3>
              <button onClick={() => setPayingFee(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handlePay} className="mt-4 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Payable Amount:</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  ₹{payingFee.amount.toLocaleString()}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Invoice: {payingFee.invoiceNo} · {payingFee.term}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Payment Mode</label>
                <div className="space-y-2">
                  {['UPI (Google Pay / PhonePe / Paytm)', 'Net Banking (All Indian Banks)', 'Debit / Credit Card'].map(opt => (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === opt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymode"
                        checked={paymentMethod === opt}
                        onChange={() => setPaymentMethod(opt)}
                        className="text-emerald-600"
                      />
                      <span className="text-xs">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingFee(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Pay ₹{payingFee.amount.toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Fee Receipt Modal / Sheet */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-sm font-bold text-slate-900">Official Electronic Fee Receipt</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="border border-slate-300 p-6 rounded-xl text-xs space-y-4">
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <GraduationCap className="w-6 h-6 text-slate-900" />
                  <span className="font-extrabold text-base tracking-wider uppercase text-slate-900">
                    SchoolDev International Academy
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Affiliated to CBSE, New Delhi · Institutional Area, Knowledge Park
                </p>
                <div className="mt-2 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider text-[10px] rounded">
                  Fee Receipt · PAID & CLEARED
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block">Receipt / Invoice No:</span>
                  <span className="font-mono font-bold text-slate-900">{viewingReceipt.invoiceNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Transaction Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{viewingReceipt.transactionId || 'TXN-88129048'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Student Name:</span>
                  <span className="font-bold text-slate-900">{viewingReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Class & Section:</span>
                  <span className="font-bold text-slate-900">Class {viewingReceipt.classId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Date:</span>
                  <span className="font-mono text-slate-900">{viewingReceipt.paidDate || '2026-11-09'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Channel:</span>
                  <span className="font-semibold text-slate-900">{viewingReceipt.paymentMethod || 'Online Gateway'}</span>
                </div>
              </div>

              {/* Table of charges */}
              <div className="py-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-300 font-bold text-slate-800">
                      <th className="py-1">Fee Description</th>
                      <th className="py-1 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-1.5 font-sans">Tuition Fee Component</td>
                      <td className="py-1.5 text-right">₹{viewingReceipt.breakdown.tuitionFee.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-sans">Science & Computer Lab Charges</td>
                      <td className="py-1.5 text-right">₹{viewingReceipt.breakdown.labFee.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-sans">School Bus Transport Fee</td>
                      <td className="py-1.5 text-right">₹{viewingReceipt.breakdown.transportFee.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-sans">Digital Library & Journal Access</td>
                      <td className="py-1.5 text-right">₹{viewingReceipt.breakdown.libraryFee.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-sans">Sports & Extra-Curricular Activity</td>
                      <td className="py-1.5 text-right">₹{viewingReceipt.breakdown.activityFee.toLocaleString()}</td>
                    </tr>
                    <tr className="border-t-2 border-slate-800 font-bold text-slate-900">
                      <td className="py-2 font-sans uppercase">Total Amount Received</td>
                      <td className="py-2 text-right text-sm">₹{viewingReceipt.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Computer generated electronic payment receipt. No physical signature required.</span>
                <span className="font-bold text-emerald-700">STATUS: VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
