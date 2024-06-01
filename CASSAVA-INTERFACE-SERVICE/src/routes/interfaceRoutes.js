const express = require('express');
const asyncHandler = require('express-async-handler');
const authenticateToken = require('../middleware/authenticateToken');
const { sendToQueue } = require('../middleware/rabbitMQProducer');
const { interfacePool } = require('../config/dbconfig'); // Correct import

const router = express.Router();

router.post('/physical-data', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const { inslot, batch, material, plant, operationno } = req.body;

        // Log the incoming request data for debugging purposes
        console.log('Incoming data:', { inslot, batch, material, plant, operationno });

        const result = await interfacePool.query(
            'INSERT INTO interface.interface_requests (inslot, batch, material, plant, operationno) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [inslot, batch, material, plant, operationno]
        );

        const storedData = result.rows[0];
        const data = {
            inslot: storedData.inslot,
            operationno: storedData.operationno,
            requestRef: storedData.request_ref
        };

        await sendToQueue(data);

        res.json({ message: 'Data stored and sent to RabbitMQ successfully', data: storedData });
    } catch (error) {
        // Log the error details for debugging
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
}));

module.exports = router;

