import express from 'express';
import { protectRoute, isAdminRoute, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  applyLeave,
  getLeaveRequests,
  updateLeaveStatus,
  getUserLeaveRequests,
} from '../controllers/leaveController.js';

const router = express.Router();

router.route('/').post(protectRoute, applyLeave).get(protectRoute, authorizeRoles('admin', 'manager'), getLeaveRequests);
router.route('/:id').put(protectRoute, authorizeRoles('admin', 'manager'), updateLeaveStatus);
router.route('/user/:id').get(protectRoute, getUserLeaveRequests);

export default router; 