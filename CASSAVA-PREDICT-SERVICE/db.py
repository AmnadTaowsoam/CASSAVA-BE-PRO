import pandas as pd
import psycopg2
from psycopg2 import extras
from config import settings
import logging

# Initialize your logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_connection():
    try:
        conn = psycopg2.connect(
            host=settings.predict_db_host,
            port=settings.predict_connect_db_port,  # Corrected from predict_connect_db_port
            dbname=settings.predict_db_name,
            user=settings.predict_db_username,
            password=settings.predict_db_password
        )
        return conn
    except psycopg2.Error as e:
        logger.error(f"Error connecting to PostgreSQL database: {e}")
        return None

def insert_batch_info(data):
    query = """
    INSERT INTO prediction.batch_info (inslot, material, batch, plant, operationno)
    VALUES %s
    ON CONFLICT (inslot, material, batch, plant, operationno) DO NOTHING;
    """
    conn = create_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                extras.execute_values(cursor, query, [tuple(data.values())])
                conn.commit()
                logger.info("Data inserted successfully into batch_info.")
        except Exception as e:
            logger.error(f"Error inserting data into batch_info: {e}")
        finally:
            conn.close()

def insert_result(data):
    query = """
    INSERT INTO prediction.result (inslot, material, batch, plant, operationno, months, fines, bulk, sand_predict_value, total_sand_value)
    VALUES %s
    ON CONFLICT (inslot, material, batch, plant, operationno) DO NOTHING;
    """
    conn = create_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                extras.execute_values(cursor, query, [tuple(data.values())])
                conn.commit()
                logger.info("Data inserted successfully into result.")
        except Exception as e:
            logger.error(f"Error inserting data into result: {e}")
        finally:
            conn.close()

def insert_mic_result(data):
    query = """
    INSERT INTO prediction.mic_result (inslot, material, batch, plant, operationno, phys0001, chem0010, chem0013)
    VALUES %s
    ON CONFLICT (inslot, material, batch, plant, operationno) DO NOTHING;
    """
    conn = create_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                extras.execute_values(cursor, query, [tuple(data.values())])
                conn.commit()
                logger.info("Data inserted successfully into mic_result.")
        except Exception as e:
            logger.error(f"Error inserting data into mic_result: {e}")
        finally:
            conn.close()

def select_data_by_vendor(vendor):
    query = """
    SELECT * FROM prediction.masters WHERE vendor = %s;
    """
    conn = create_connection()
    if conn:
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
                cursor.execute(query, (vendor,))
                result = cursor.fetchall()
                df = pd.DataFrame(result, columns=[desc[0] for desc in cursor.description])
                return df
        except Exception as e:
            logger.error(f"Error selecting data from masters: {e}")
            return None
        finally:
            conn.close()
