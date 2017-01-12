'use strict';
import express from 'express';
const router = express.Router();
import authRoutes from './auth';
import usersRoutes from './users';
import messagesRoutes from './messages';
import {API_ROOT} from '../../constants/infos';


router.use('/', authRoutes);
/**
 * @api {get} / Api Root
 * @apiName Root
 * @apiGroup API
 * @apiPermission Authentified
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        info: API_ROOT
    });
});


router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);


export default router;