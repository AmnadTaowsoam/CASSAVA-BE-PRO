const { predictionPool } = require('../config/dbconfig'); 

// Function to insert data into result table
async function insertResult(data) {
    const query = `
        INSERT INTO prediction.result (inslot, material, batch, plant, operationno, months, fines, bulk, sand_predict_value, total_sand_value)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (inslot, material, batch, plant, operationno) DO NOTHING;
    `;
    const values = [
        data.inslot, data.material, data.batch, data.plant, data.operationno,
        data.months, data.fines, data.bulk, data.sand_predict_value, data.total_sand_value
    ];

    try {
        await predictionPool.query(query, values);
        return { message: 'Data inserted successfully into result.' };
    } catch (error) {
        console.error('Error inserting data into result:', error);
        throw error;
    }
}

// Function to get predictions by criteria
async function getPredictByCriteria(inslot, batch, material, plant, operationno) {
    const query = `
        SELECT * FROM prediction.result
        WHERE inslot = $1 AND batch = $2 AND material = $3 AND plant = $4 AND operationno = $5;
    `;
    const values = [inslot, batch, material, plant, operationno];

    try {
        const res = await predictionPool.query(query, values);
        return res.rows;
    } catch (error) {
        console.error('Error fetching data from result:', error);
        throw error;
    }
}

// Function to get all results
async function getAllResults() {
    const query = 'SELECT * FROM prediction.result;';

    try {
        const res = await predictionPool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error fetching all results:', error);
        throw error;
    }
}

module.exports = {
    insertResult,
    getPredictByCriteria,
    getAllResults,
};
