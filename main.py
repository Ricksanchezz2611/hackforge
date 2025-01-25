from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
from io import BytesIO
import os
import numpy as np


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can limit it like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

model = load_model("../model/model.keras")

class PredictRequest(BaseModel):
    image_path: str


@app.get("/")
async def read_root():
    return {"message": "Scan-O-Tron is live!!!!"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read the image file
    img_bytes = await file.read()
    img = Image.open(BytesIO(img_bytes))

    # Preprocessing
    img = img.resize((200, 200))

    # If the image is grayscale, convert it to RGB (3 channels)
    if img.mode != 'RGB':
        img = img.convert('RGB')

    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Make prediction
    prediction = model.predict(img_array)
    prediction_value = float(prediction[0][0])

    return {
        "prediction": prediction_value
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
