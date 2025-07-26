import React, { useState } from 'react';
import Title from '../components/Title';
import { useGetLeaveRequestsQuery, useUpdateLeaveStatusMutation } from '../redux/slices/api/leaveApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { dateFormatter } from '../utils';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Loading from '../components/Loading';
import ConfirmatioDialog from '../components/ConfirmationDialog';

const LeaveRequests = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: leaveRequests, isLoading, refetch } = useGetLeaveRequestsQuery();
  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogType, setDialogType] = useState(''); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');

  const handleAction = async (id, status, type) => {
    setSelectedLeave(id);
    setDialogType(type);
    setOpenDialog(true);
  };

  const confirmAction = async () => {
    try {
      await updateLeaveStatus({
        id: selectedLeave,
        status: dialogType === 'approve' ? 'Approved' : 'Rejected',
        rejectionReason: dialogType === 'reject' ? rejectionReason : undefined,
      }).unwrap();
      toast.success(`Leave request ${dialogType === 'approve' ? 'approved' : 'rejected'} successfully!`);
      refetch();
      setOpenDialog(false);
      setRejectionReason('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>User</th>
        <th className='py-2'>Leave Type</th>
        <th className='py-2'>Start Date</th>
        <th className='py-2'>End Date</th>
        <th className='py-2'>Reason</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ leave }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='flex flex-col'>
            <p className='text-black text-sm font-medium'>{leave.user?.name}</p>
            <span className='text-sm text-gray-500'>{leave.user?.email}</span>
          </div>
        </div>
      </td>
      <td className='py-2'>{leave.leaveType}</td>
      <td className='py-2'>{dateFormatter(new Date(leave.startDate))}</td>
      <td className='py-2'>{dateFormatter(new Date(leave.endDate))}</td>
      <td className='py-2'>{leave.reason}</td>
      <td className='py-2'>
        <span
          className={clsx(
            'px-3 py-1 rounded-full text-sm',
            leave.status === 'Approved' && 'bg-green-100 text-green-700',
            leave.status === 'Pending' && 'bg-yellow-100 text-yellow-700',
            leave.status === 'Rejected' && 'bg-red-100 text-red-700',
            leave.status === 'Cancelled' && 'bg-gray-100 text-gray-700'
          )}
        >
          {leave.status}
        </span>
      </td>
      <td className='py-2'>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button className='inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'>
            Actions
            <MdOutlineKeyboardArrowDown className='-mr-1 ml-2 h-5 w-5' aria-hidden='true' />
          </Menu.Button>

          <Transition
            as={React.Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                {leave.status === 'Pending' && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleAction(leave._id, 'Approved', 'approve')}
                        className={clsx(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm w-full text-left'
                        )}
                      >
                        Approve
                      </button>
                    )}
                  </Menu.Item>
                )}
                {leave.status === 'Pending' && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleAction(leave._id, 'Rejected', 'reject')}
                        className={clsx(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm w-full text-left'
                        )}
                      >
                        Reject
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
    </tr>
  );

  return isLoading ? (
    <Loading />
  ) : (
    <div className='p-4'>
      <Title title='Leave Requests' />
      <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded-lg'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody>
              {leaveRequests?.map((leave) => (
                <TableRow key={leave._id} leave={leave} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={confirmAction}
        message={`Are you sure you want to ${dialogType} this leave request?`}
        cancelTitle='Cancel'
        confirmTitle={dialogType === 'approve' ? 'Approve' : 'Reject'}
        rejectionReason={dialogType === 'reject' ? rejectionReason : undefined}
        setRejectionReason={setRejectionReason}
        showRejectionReasonInput={dialogType === 'reject'}
      />
    </div>
  );
};

export default LeaveRequests; 