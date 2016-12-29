'use strict';
import express from 'express';
const router = express.Router();
import authRoutes from './auth';
import usersRoutes from './users';
import messagesRoutes from './messages';


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
        info: 'api root'
    });
});


router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);


export default router;