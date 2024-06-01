import logging
from datetime import datetime
import pandas as pd
import joblib
from db import insert_batch_info, insert_result, insert_mic_result
import warnings

warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the model, adjust the path as necessary
def load_model(path='./best_model/Linear_Cassava_Model.pkl'):
    try:
        model = joblib.load(path)
        logger.info("Model loaded successfully.")
        return model
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return None

model = load_model()


def transform_data(input_data):
    try:
        month = int(input_data['month']) 
        fines = float(input_data['fines'])
        bulk = float(input_data['bulk'])
    except ValueError as e:
        logger.error(f"Error converting fines or bulk to float: {e}")
        fines = 0.0  # Default to zero or consider raising an exception
        bulk = 0.0

    df = pd.DataFrame({
        'month': [month],
        'plant': [input_data['plant']],
        'vendor': [input_data['vendor']],
        'fines': [fines],
        'bulk': [bulk]
    })

    return df

def predict_sand(df):
    if model is None:
        return {'error': 'Model is not loaded.'}, None
    try:
        sand_predict_value = model.predict(df)
        sand_value = float(sand_predict_value[0])
        total_sand_value = (sand_value * df['fines'].iloc[0]) / 100
        sand_predict_value_rounded = round(sand_value, 2)
        total_sand_value_rounded = round(total_sand_value, 2)
        return sand_predict_value_rounded, total_sand_value_rounded
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        return {'error': 'Prediction failed due to an error.'}, None

def prepare_data_for_batch_info(input_data):
    data_for_batch_info = {
        'inslot': input_data['inslot'],
        'material': input_data['material'],
        'batch': input_data['batch'],
        'plant': input_data['plant'],
        'operationno': input_data['operationno']
    }
    insert_batch_info(data_for_batch_info)
    return data_for_batch_info

def prepare_data_for_result(input_data, sand_predict_value, total_sand_value):
    data_for_result = {
        'inslot': input_data['inslot'],
        'material': input_data['material'],
        'batch': input_data['batch'],
        'plant': input_data['plant'],
        'operationno': input_data['operationno'],
        'months': input_data['month'],
        'fines': input_data['fines'],
        'bulk': input_data['bulk'],
        'sand_predict_value': sand_predict_value,
        'total_sand_value': total_sand_value
    }
    insert_result(data_for_result)
    return data_for_result

def prepare_data_for_mic_result(input_data, total_sand_value):
    data_for_mic_result = {
        'inslot': input_data['inslot'],
        'material': input_data['material'],
        'batch': input_data['batch'],
        'plant': input_data['plant'],
        'operationno': input_data['operationno'],
        'phys0001': input_data['fines'],
        'chem0010': input_data['bulk'],
        'chem0013': total_sand_value
    }
    insert_mic_result(data_for_mic_result)
    return data_for_mic_result

def process_prediction(input_data):
    # Transform data
    df = transform_data(input_data)
    logger.info(f"Transformed data: {df}")

    # Predict sand
    sand_predict_value, total_sand_value = predict_sand(df)
    if isinstance(sand_predict_value, dict) and 'error' in sand_predict_value:
        logger.error(sand_predict_value['error'])
        return sand_predict_value

    logger.info(f"Prediction - Sand Predict Value: {sand_predict_value}, Total Sand Value: {total_sand_value}")

    # Prepare data for batch info
    batch_info = prepare_data_for_batch_info(input_data)
    logger.info(f"Batch info: {batch_info}")

    # Prepare data for result
    result_info = prepare_data_for_result(input_data, sand_predict_value, total_sand_value)
    logger.info(f"Result info: {result_info}")

    # Prepare data for mic result
    mic_result_info = prepare_data_for_mic_result(input_data, total_sand_value)
    logger.info(f"MIC result info: {mic_result_info}")

    return {
        "batch_info": batch_info,
        "result_info": result_info,
        "mic_result_info": mic_result_info
    }