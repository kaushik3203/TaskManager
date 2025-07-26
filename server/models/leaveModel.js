import mongoose from 'mongoose';

const leaveSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    leaveType: {
      type: String,
      required: true,
      enum: ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Bereavement Leave', 'Compensatory Off', 'Loss of Pay'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave; 