CREATE SCHEMA IF NOT EXISTS prediction;

-- Batch Information Table
CREATE TABLE IF NOT EXISTS prediction.batch_info (
    id SERIAL PRIMARY KEY,
    inslot TEXT NOT NULL,
    material TEXT NOT NULL,
    batch TEXT NOT NULL,
    plant TEXT NOT NULL,
    operationno TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (inslot, material, batch, plant, operationno)
);

-- Result Table
CREATE TABLE IF NOT EXISTS prediction.result (
    id SERIAL PRIMARY KEY,
    inslot TEXT NOT NULL,
    material TEXT NOT NULL,
    batch TEXT NOT NULL,
    plant TEXT NOT NULL,
    operationno TEXT NOT NULL,
    months TEXT NOT NULL,
    fines NUMERIC,
    bulk NUMERIC,
    sand_predict_value NUMERIC,
    total_sand_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (inslot, material, batch, plant, operationno)  -- Added unique constraint
);

-- Mic Result Table
CREATE TABLE IF NOT EXISTS prediction.mic_result (
    id SERIAL PRIMARY KEY,
    inslot TEXT NOT NULL,
    material TEXT NOT NULL,
    batch TEXT NOT NULL,
    plant TEXT NOT NULL,
    operationno TEXT NOT NULL,
    phys0001 NUMERIC,
    chem0010 NUMERIC,
    chem0013 NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (inslot, material, batch, plant, operationno)
);
