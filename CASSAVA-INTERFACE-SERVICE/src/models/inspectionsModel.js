//src/models/inspectionsModel.js
const { interfacePool } = require('../config/dbconfig');

// CREATE
const createInspection = async (request_ref, insp_lot, plant, operation, sample_no, phys001, chem010, chem013, status, message) => {
    const result = await interfacePool.query(
        'INSERT INTO interface.inspections (request_ref, insp_lot, plant, operation, sample_no, phys001, chem010, chem013, status, message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [request_ref, insp_lot, plant, operation, sample_no, phys001, chem010, chem013, status, message]
    );
    return result.rows[0];
};

// READ
const getInspections = async () => {
    const result = await interfacePool.query('SELECT * FROM interface.inspections');
    return result.rows;
};

// UPDATE
const updateInspection = async (id, request_ref, insp_lot, plant, operation, sample_no, phys001, chem010, chem013, status, message) => {
    const result = await interfacePool.query(
        'UPDATE interface.inspections SET request_ref = $1, insp_lot = $2, plant = $3, operation = $4, sample_no = $5, phys001 = $6, chem010 = $7, chem013 = $8, status = $9, message = $10 WHERE id = $11 RETURNING *',
        [request_ref, insp_lot, plant, operation, sample_no, phys001, mic_phys004, chem010, chem013, status, message, id]
    );
    return result.rows[0];
};

// DELETE
const deleteInspection = async (id) => {
    await interfacePool.query('DELETE FROM interface.inspections WHERE id = $1', [id]);
};

module.exports = {
    createInspection,
    getInspections,
    updateInspection,
    deleteInspection,
};