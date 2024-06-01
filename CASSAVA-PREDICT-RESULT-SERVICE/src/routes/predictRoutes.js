const express = require('express');
const router = express.Router();
const predictModel = require('../models/predictModels');

// Route to get all results
router.get('/', async (req, res) => {
    try {
        const results = await predictModel.getAllResults();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// Route to insert a new result
router.post('/', async (req, res) => {
    const data = req.body;

    try {
        const response = await predictModel.insertResult(data);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to insert result' });
    }
});

// Route to get results by specific criteria
router.get('/results', async (req, res) => {
    const { inslot, batch, material, plant, operationno } = req.query;

    try {
        const results = await predictModel.getPredictByCriteria(inslot, batch, material, plant, operationno);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch results by criteria' });
    }
});

module.exports = router;


