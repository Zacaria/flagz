'use strict';

import express from 'express';
import {gen, poll} from '../../config/sys-info';
import Message from '../../models/message';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'infos root'
    });
});

router.get('/gen', (req, res) => {
    res.json(gen());
});

router.get('/poll', (req, res) => {
    res.json(poll());
});

export default router;
