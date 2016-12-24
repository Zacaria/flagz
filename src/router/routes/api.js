'use strict';
import express from 'express';
const router = express.Router();
import usersRoutes from './users';
import messagesRoutes from './messages';

/**
 * @api {get} / Api Root
 * @apiName Root
 * @apiGroup API
 * @apiPermission Authentified
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'api root'
    });
});

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);


export default router;