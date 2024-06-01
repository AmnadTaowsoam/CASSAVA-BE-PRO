const express = require('express');
const router = express.Router();
const interfaceModel = require('../models/interfaceModels');

// Route to get all interfaces
router.get('/', async (req, res) => {
    try {
        const interfaces = await interfaceModel.getAllInterfaces();
        res.json(interfaces);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all interfaces' });
    }
});

// Route to insert a new interface
router.post('/', async (req, res) => {
    const data = req.body;

    try {
        const response = await interfaceModel.insertInterface(data);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to insert interface' });
    }
});

// Route to update an existing interface
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const response = await interfaceModel.updateInterface(id, data);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update interface' });
    }
});

// Route to delete an interface
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await interfaceModel.deleteInterface(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete interface' });
    }
});

// Route to get interfaces by specific criteria and send to RabbitMQ
router.get('/search', async (req, res) => {
    const { inslot, batch, material, plant, operationno } = req.query;

    try {
        const interfaces = await interfaceModel.getInterfacesByCriteria(inslot, batch, material, plant, operationno);
        res.json(interfaces);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to fetch and send interface data', error: err.message });
    }
});

module.exports = router;
