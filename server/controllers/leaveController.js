import Leave from '../models/leaveModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Apply for leave
// @route   POST /api/leave
// @access  Private
const applyLeave = asyncHandler(async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const leave = await Leave.create({
    user: req.user._id,
    leaveType,
    startDate,
    endDate,
    reason,
  });

  if (leave) {
    res.status(201).json({
      _id: leave._id,
      user: leave.user,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
      createdAt: leave.createdAt,
    });
  } else {
    res.status(400);
    throw new Error('Invalid leave request data');
  }
});

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leave
// @access  Private/Admin
const getLeaveRequests = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json(leaves);
});

// @desc    Update leave status (Admin only)
// @route   PUT /api/leave/:id
// @access  Private/Admin
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  const leave = await Leave.findById(req.params.id);

  if (leave) {
    leave.status = status || leave.status;
    leave.approvedBy = req.user._id; // Set the user who approved/rejected the leave
    if (status === 'Rejected') {
      leave.rejectionReason = rejectionReason || 'No reason provided';
    } else {
      leave.rejectionReason = undefined; // Clear rejection reason if not rejected
    }

    const updatedLeave = await leave.save();
    res.status(200).json({
      _id: updatedLeave._id,
      leaveType: updatedLeave.leaveType,
      startDate: updatedLeave.startDate,
      endDate: updatedLeave.endDate,
      reason: updatedLeave.reason,
      status: updatedLeave.status,
      approvedBy: updatedLeave.approvedBy,
      rejectionReason: updatedLeave.rejectionReason,
    });
  } else {
    res.status(404);
    throw new Error('Leave request not found');
  }
});

// @desc    Get user's leave requests
// @route   GET /api/leave/user/:id
// @access  Private
const getUserLeaveRequests = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ user: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json(leaves);
});

export { applyLeave, getLeaveRequests, updateLeaveStatus, getUserLeaveRequests }; 