import express from 'express';
import cors from 'cors';

import numberController from '../controllers/numberController.js';

const router = express.Router();

router.use(cors());

router.use(express.json());

router.get('/number', numberController.getNumber);
router.post('/number', numberController.saveNumber);
router.delete('/number', numberController.deleteNumber);

export default router;