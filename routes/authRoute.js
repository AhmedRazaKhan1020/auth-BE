import express from 'express';
import { register, login, uploadReport,getUserReports } from '../controller/authController.js';
import requireAuth from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upload-report', requireAuth, upload.single('file'), uploadReport);
router.get('/reports', requireAuth, getUserReports);

export default router;
