'use strict';

import express from 'express';
import {gen, poll} from '../../config/sys-info';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'infos root'
    });
});

/**
 * @api {get} /gen Request Instance information
 * @apiName Generation
 * @apiGroup Info
 * @apiSampleRequest /
 */
router.get('/gen', (req, res) => {
    res.json(gen());
});

/**
 * @api {get} /poll Request Poll information
 * @apiName Poll
 * @apiGroup Info
 */
router.get('/poll', (req, res) => {
    res.json(poll());
});

export default router;
