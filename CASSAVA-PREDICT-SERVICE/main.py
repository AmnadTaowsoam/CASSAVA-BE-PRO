import os
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import uvicorn
from pydantic import BaseModel, ValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from cassava_processing import process_prediction
from auth import router as auth_router
from config import Settings
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
settings = Settings()

class PredictionRequest(BaseModel):
    inslot: str
    material: str
    batch: str
    plant: str
    operationno: str
    month: int
    vendor: str
    fines: float
    bulk: float

app = FastAPI()

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.include_router(auth_router)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/sand-predict", status_code=200)
async def sand_predict(request: Request, token: str = Depends(oauth2_scheme)):
    try:
        request_data = await request.json()
        logger.info(f"Received request data: {request_data}")
        
        input_data = PredictionRequest(**request_data).dict()
        result = process_prediction(input_data)
        
        if 'error' in result:
            logger.error(result['error'])
            raise HTTPException(status_code=500, detail=result['error'])

        return JSONResponse(status_code=200, content={"detail": "Prediction processed successfully", "result": result})

    except ValidationError as ve:
        logger.error(f"Validation error: {ve.json()}")
        return JSONResponse(status_code=422, content={"detail": ve.errors()})
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

if __name__ == '__main__':
    uvicorn.run(app, host=settings.predict_service_host, port=settings.predict_service_port)
