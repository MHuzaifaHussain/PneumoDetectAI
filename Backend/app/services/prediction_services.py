import numpy as np
from tensorflow.keras.models import load_model
from app.utils.cloudinary_helper import upload_to_cloudinary
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.image_utils import preprocess_image

model = load_model("models/pneumonia_detection_model.keras", compile=False)
class_names = ['Normal', 'Pneumonia']

# MongoDB setup
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["pneumonia_db"]
predictions = db["predictions"]
users = db["users"]


async def predict_and_save(file, user_email: str):
    user = await users.find_one({"email": user_email})
    if not user:
        raise ValueError("User not found")

    contents = await file.read()

    # Preprocess and predict
    img_array = preprocess_image(contents)
    pred = model.predict(img_array)
    class_index = int(np.argmax(pred))
    confidence = float(np.max(pred))
    label = class_names[class_index]

    cloudinary_url = upload_to_cloudinary(contents)
    
    utc_timestamp = datetime.now(timezone.utc)
    
    await predictions.insert_one({
        "user_id": user["user_id"],
        "email": user_email,
        "label": label,
        "confidence": round(confidence * 100, 2),
        "image_url": cloudinary_url,
        "timestamp": utc_timestamp
    })

    return {
        "disease": label,
        "confidence": round(confidence * 100, 2),
        "image_url": cloudinary_url,
        "timestamp": utc_timestamp.isoformat(),
    }
