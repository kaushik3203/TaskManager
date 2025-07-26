import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useApplyLeaveMutation } from '../redux/slices/api/leaveApiSlice';
import { toast } from 'sonner';
import Title from '../components/Title';
import Button from '../components/Button';
import Textbox from '../components/Textbox';
import { DatePicker } from '@tremor/react';

const ApplyLeave = () => {
  const { user } = useSelector((state) => state.auth);
  const [applyLeave] = useApplyLeaveMutation();

  const [leaveData, setLeaveData] = useState({
    leaveType: '',
    startDate: null,
    endDate: null,
    reason: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData({ ...leaveData, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setLeaveData({ ...leaveData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...leaveData,
        startDate: leaveData.startDate ? leaveData.startDate.toISOString() : null,
        endDate: leaveData.endDate ? leaveData.endDate.toISOString() : null,
      };
      await applyLeave(payload).unwrap();
      toast.success('Leave request submitted successfully!');
      setLeaveData({ leaveType: '', startDate: null, endDate: null, reason: '' });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='p-4'>
      <Title title='Apply for Leave' />
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md mt-4'>
        <div className='mb-4'>
          <label htmlFor='leaveType' className='block text-gray-700 text-sm font-bold mb-2'>
            Leave Type
          </label>
          <select
            id='leaveType'
            name='leaveType'
            value={leaveData.leaveType}
            onChange={handleChange}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value=''>Select Leave Type</option>
            <option value='Casual Leave'>Casual Leave</option>
            <option value='Sick Leave'>Sick Leave</option>
            <option value='Annual Leave'>Annual Leave</option>
            <option value='Maternity Leave'>Maternity Leave</option>
            <option value='Paternity Leave'>Paternity Leave</option>
            <option value='Bereavement Leave'>Bereavement Leave</option>
            <option value='Compensatory Off'>Compensatory Off</option>
            <option value='Loss of Pay'>Loss of Pay</option>
          </select>
        </div>

        <div className='grid md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label htmlFor='startDate' className='block text-gray-700 text-sm font-bold mb-2'>
              Start Date
            </label>
            <DatePicker
              value={leaveData.startDate}
              onValueChange={(date) => handleDateChange('startDate', date)}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div>
            <label htmlFor='endDate' className='block text-gray-700 text-sm font-bold mb-2'>
              End Date
            </label>
            <DatePicker
              value={leaveData.endDate}
              onValueChange={(date) => handleDateChange('endDate', date)}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
        </div>

        <Textbox
          label='Reason'
          type='text'
          name='reason'
          value={leaveData.reason}
          onChange={handleChange}
          required
          styles='w-full'
        />

        <Button
          type='submit'
          label='Submit Leave Request'
          className='bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 focus:outline-none focus:shadow-outline'
        />
      </form>
    </div>
  );
};

export default ApplyLeave; 