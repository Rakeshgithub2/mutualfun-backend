import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createAlert, getAlerts } from '../controllers/alerts';

const router = Router();

router.use(authenticate);

router.post('/', createAlert);
router.get('/', getAlerts);

export default router;