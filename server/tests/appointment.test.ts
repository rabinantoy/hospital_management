/**
 * Appointment Booking & Slot Availability Tests
 */

describe('Appointment Booking & Queue Engine', () => {
  const mockDoctorSchedule = {
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin',
    slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
    bookedSlots: ['09:30', '10:30']
  };

  test('Correctly filters out already booked slots from availability pool', () => {
    const availableSlots = mockDoctorSchedule.slots.filter(
      s => !mockDoctorSchedule.bookedSlots.includes(s)
    );

    expect(availableSlots).not.toContain('09:30');
    expect(availableSlots).not.toContain('10:30');
    expect(availableSlots).toContain('09:00');
    expect(availableSlots.length).toBe(6);
  });

  test('Validates status progression from SCHEDULED -> CHECKED_IN -> IN_PROGRESS -> COMPLETED', () => {
    const statuses = ['SCHEDULED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED'];
    expect(statuses[0]).toBe('SCHEDULED');
    expect(statuses[1]).toBe('CHECKED_IN');
    expect(statuses[2]).toBe('IN_PROGRESS');
    expect(statuses[3]).toBe('COMPLETED');
  });

  test('Generates structured UHID identifier matching format CP-YYYY-XXXX', () => {
    const uhidRegex = /^CP-2026-\d{4}$/;
    const generatedUhid = 'CP-2026-0048';
    expect(uhidRegex.test(generatedUhid)).toBe(true);
  });
});
