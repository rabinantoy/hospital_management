import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PrescriptionItem } from '../../types';
import { X, Stethoscope, Plus, Trash2, Pill, FlaskConical } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedAppointmentId?: string;
}

export const ConsultationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedAppointmentId
}) => {
  const {
    currentUser,
    patients,
    medicines,
    labTests,
    createConsultation,
    createPrescription,
    createLabOrder,
    updateAppointmentStatus
  } = useHospital();

  const [patientId, setPatientId] = useState(preselectedPatientId || (patients[0]?.id || ''));
  const [chiefComplaint, setChiefComplaint] = useState('Follow-up review for chronic illness management');
  const [symptoms, setSymptoms] = useState('Reports intermittent shortness of breath during exertion; no fever or chills.');
  const [diagnosis, setDiagnosis] = useState('I10 - Essential (Primary) Hypertension');
  const [clinicalNotes, setClinicalNotes] = useState('Normal S1/S2 heart sounds, chest clear bilaterally, extremities without edema. Vitals stable.');
  const [treatmentPlan, setTreatmentPlan] = useState('Dietary sodium restriction, regular aerobic exercise 30m/day. Continue current antihypertensives.');

  // Prescription Items
  const [prescriptionItems, setPrescriptionItems] = useState<Array<{
    medicineId: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    instructions: string;
  }>>([
    {
      medicineId: medicines[0]?.id || '',
      dosage: '1 Tablet (20mg)',
      frequency: '0-0-1 (At bedtime)',
      durationDays: 30,
      instructions: 'Take after dinner. Avoid grapefruit.'
    }
  ]);

  // Selected Lab Orders
  const [selectedLabTestIds, setSelectedLabTestIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddMedRow = () => {
    setPrescriptionItems(prev => [
      ...prev,
      {
        medicineId: medicines[0]?.id || '',
        dosage: '1 Tablet',
        frequency: '1-0-1 (Twice daily after food)',
        durationDays: 14,
        instructions: 'Take with full glass of water.'
      }
    ]);
  };

  const handleRemoveMedRow = (index: number) => {
    setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleMedChange = (index: number, field: string, value: any) => {
    setPrescriptionItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const toggleLabTest = (testId: string) => {
    setSelectedLabTestIds(prev =>
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // 1. Create Consultation
    const newConsult = createConsultation({
      patientId: patient.id,
      patientName: patient.fullName,
      patientUhid: patient.uhid,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      doctorSpecialization: currentUser.specialization || 'Clinical Specialist',
      appointmentId: preselectedAppointmentId,
      chiefComplaint: chiefComplaint.trim(),
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      clinicalNotes: clinicalNotes.trim(),
      treatmentPlan: treatmentPlan.trim()
    });

    // 2. Create Prescription if any items exist
    if (prescriptionItems.length > 0) {
      const formattedItems: PrescriptionItem[] = prescriptionItems.map((item, idx) => {
        const med = medicines.find(m => m.id === item.medicineId);
        return {
          id: `item-${Date.now()}-${idx}`,
          medicineId: item.medicineId,
          medicineName: med?.name || 'Medication',
          genericName: med?.genericName || 'Generic',
          dosage: item.dosage,
          frequency: item.frequency,
          durationDays: Number(item.durationDays),
          instructions: item.instructions,
          isDispensed: false
        };
      });

      createPrescription({
        consultationId: newConsult.id,
        patientId: patient.id,
        patientName: patient.fullName,
        patientUhid: patient.uhid,
        doctorId: currentUser.id,
        doctorName: currentUser.name,
        items: formattedItems
      });
    }

    // 3. Create Lab Orders
    selectedLabTestIds.forEach(testId => {
      createLabOrder(testId, patient.id, `Ordered during consultation for ${diagnosis}`);
    });

    // 4. Mark appointment as COMPLETED if linked
    if (preselectedAppointmentId) {
      updateAppointmentStatus(preselectedAppointmentId, 'COMPLETED');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Doctor Clinical Encounter & E-Prescription
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Physician: {currentUser.name} ({currentUser.specialization || 'Attending'})
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Patient Selection & Allergies Notice */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.uhid}) — Age: {p.age}y, Allergies: {p.allergies.join(', ')}
                </option>
              ))}
            </select>
          </div>

          {/* Chief Complaint & Symptoms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chief Complaint *
              </label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="e.g. Exertional chest tightness, dizziness"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Diagnosis / ICD-10 *
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                placeholder="e.g. I10 - Essential Hypertension"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Presenting Symptoms & Patient History
            </label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Physical Examination & Assessment
            </label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Treatment Plan & Lifestyle Advice
            </label>
            <textarea
              rows={2}
              value={treatmentPlan}
              onChange={e => setTreatmentPlan(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Section: E-Prescriptions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-[11px]">
                <Pill className="w-3.5 h-3.5" />
                <span>Electronic Prescriptions (Sent to Pharmacy)</span>
              </div>
              <button
                type="button"
                onClick={handleAddMedRow}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-2">
              {prescriptionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Medicine</label>
                    <select
                      value={item.medicineId}
                      onChange={e => handleMedChange(idx, 'medicineId', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      {medicines.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.strength}) — Stock: {m.stockQuantity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Dosage / Frequency</label>
                    <input
                      type="text"
                      value={item.frequency}
                      onChange={e => handleMedChange(idx, 'frequency', e.target.value)}
                      placeholder="e.g. 1-0-1 (After food)"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Days</label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={item.durationDays}
                      onChange={e => handleMedChange(idx, 'durationDays', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Instructions</label>
                    <input
                      type="text"
                      value={item.instructions}
                      onChange={e => handleMedChange(idx, 'instructions', e.target.value)}
                      placeholder="Special note"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedRow(idx)}
                      disabled={prescriptionItems.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Diagnostic Lab Test Orders */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-[11px] mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Order Diagnostic Tests (Sent to Laboratory)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {labTests.map(test => {
                const isSelected = selectedLabTestIds.includes(test.id);
                return (
                  <button
                    type="button"
                    key={test.id}
                    onClick={() => toggleLabTest(test.id)}
                    className={`p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">{test.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Sample: {test.sampleType} · Turnaround: {test.turnaroundHours}h
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px] font-bold">
                      ${test.price.toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors"
            >
              Finalize Consultation & Issue Orders
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
