'use strict';

import express from 'express';
import {gen, poll} from '../../constants/sys-info';
import {INFO_ROOT} from '../../constants/infos';

const router = express.Router();

/**
 * @api {get} / Infos root
 * @apiName Info
 * @apiGroup Info
 * @apiSampleRequest /
 */
router.get('/', (req, res) => {
    res.json({
        info: INFO_ROOT
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
 * @apiSampleRequest /
 */
router.get('/poll', (req, res) => {
    res.json(poll());
});

export default router;
