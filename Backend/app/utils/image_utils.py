from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from PIL import Image


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocesses the uploaded image to match the model's input requirements.
    - Opens the image from bytes.
    - Converts to RGB.
    - Resizes to 224x224 pixels.
    - Converts to a numpy array.
    - Rescales pixel values to the [0, 1] range.
    - Adds a batch dimension.
    """
    try:
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0
        return img_array
    except Exception as e:
        raise ValueError(f"Error during image preprocessing: {str(e)}")
