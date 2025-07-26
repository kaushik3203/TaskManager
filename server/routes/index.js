import express from 'express';
import userRoutes from './userRoute.js';
import taskRoutes from './taskRoute.js';
import leaveRoutes from './leaveRoute.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/task', taskRoutes);
router.use('/leave', leaveRoutes); // Add leave routes

export default router;
