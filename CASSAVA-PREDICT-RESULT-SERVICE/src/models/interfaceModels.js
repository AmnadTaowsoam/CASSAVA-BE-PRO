const { predictionPool } = require('../config/dbconfig');

// Function to insert data into mic_result table
async function insertInterface(data) {
    const query = `
        INSERT INTO prediction.mic_result (inslot, material, batch, plant, operationno, phys0001, chem0010, chem0013)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (inslot, material, batch, plant, operationno) DO NOTHING;
    `;
    const values = [
        data.inslot, data.material, data.batch, data.plant, data.operationno,
        data.phys0001, data.chem0010, data.chem0013
    ];

    try {
        await predictionPool.query(query, values);
        return { message: 'Data inserted successfully into mic_result.' };
    } catch (error) {
        console.error('Error inserting data into mic_result:', error);
        throw error;
    }
}

// Function to update data in mic_result table
async function updateInterface(id, data) {
    const query = `
        UPDATE prediction.mic_result
        SET inslot = $1, material = $2, batch = $3, plant = $4, operationno = $5,
            phys0001 = $6, chem0010 = $7, chem0013 = $8, updated_at = CURRENT_TIMESTAMP
        WHERE id = $9;
    `;
    const values = [
        data.inslot, data.material, data.batch, data.plant, data.operationno,
        data.phys0001, data.chem0010, data.chem0013, id
    ];

    try {
        await predictionPool.query(query, values);
        return { message: 'Data updated successfully in mic_result.' };
    } catch (error) {
        console.error('Error updating data in mic_result:', error);
        throw error;
    }
}

// Function to delete data from mic_result table
async function deleteInterface(id) {
    const query = 'DELETE FROM prediction.mic_result WHERE id = $1;';
    const values = [id];

    try {
        await predictionPool.query(query, values);
        return { message: 'Data deleted successfully from mic_result.' };
    } catch (error) {
        console.error('Error deleting data from mic_result:', error);
        throw error;
    }
}

// Function to get interfaces by criteria
async function getInterfacesByCriteria(inslot, batch, material, plant, operationno) {
    const query = `
        SELECT * FROM prediction.mic_result
        WHERE inslot = $1 AND batch = $2 AND material = $3 AND plant = $4 AND operationno = $5;
    `;
    const values = [inslot, batch, material, plant, operationno];

    try {
        const res = await predictionPool.query(query, values);
        return res.rows;
    } catch (error) {
        console.error('Error fetching data from mic_result:', error);
        throw error;
    }
}

// Function to get all interfaces
async function getAllInterfaces() {
    const query = 'SELECT * FROM prediction.mic_result;';

    try {
        const res = await predictionPool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error fetching all data from mic_result:', error);
        throw error;
    }
}

module.exports = {
    insertInterface,
    updateInterface,
    deleteInterface,
    getInterfacesByCriteria,
    getAllInterfaces,
};

