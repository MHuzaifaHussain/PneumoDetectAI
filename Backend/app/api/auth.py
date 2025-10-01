from fastapi import APIRouter, Depends, Response, HTTPException, status, BackgroundTasks
from fastapi_jwt_auth import AuthJWT
from app.models.schema import UserCreate, UserLogin, UserResponse
from app.services.auth_services import hash_password, verify_password, set_access_token_cookie, clear_access_token_cookie
from app.config import conf
from fastapi_mail import FastMail, MessageSchema, MessageType
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.user_model import UserDB
import random
from datetime import datetime
import os

router = APIRouter()
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["pneumonia_db"]
users = db["users"]

async def get_next_user_id():
    last = await users.find_one(sort=[("user_id", -1)])
    return last["user_id"] + 1 if last else 1


async def send_verification_email(email: str, token: str, username: str):
    fm = FastMail(conf)
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    verification_link = f"{frontend_url}/verify-email?email={email}&token={token}"

    html_body = f"""
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                    margin: 0;
                    padding: 20px;
                    background-color: #0a091e; /* Dark background */
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #16152d; /* Dark card background */
                    border-radius: 12px;
                    border: 1px solid #3a3852;
                    overflow: hidden;
                    color: #e0e0e0; /* Light text */
                }}
                .header {{
                    text-align: center;
                    padding: 30px 20px;
                    border-bottom: 1px solid #3a3852;
                    background-color: #1e1b3a;
                }}
                .header img {{
                    width: 56px;
                    height: 56px;
                }}
                .header h1 {{
                    font-size: 28px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 10px 0 0;
                }}
                .content {{
                    padding: 30px 20px;
                    line-height: 1.6;
                }}
                .content h2 {{
                    font-size: 22px;
                    color: #ffffff;
                    margin-top: 0;
                }}
                .content p {{
                    margin: 0 0 16px;
                    color: #a9a7c4;
                }}
                .button-container {{
                    text-align: center;
                    margin: 30px 0;
                }}
                .button {{
                    display: inline-block;
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 8px;
                    background: linear-gradient(to right, #4f46e5, #9333ea); /* Indigo to Purple gradient */
                }}
                .footer {{
                    text-align: center;
                    font-size: 12px;
                    color: #7a7899;
                    padding: 20px;
                    border-top: 1px solid #3a3852;
                    background-color: #0a091e;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <!-- Using a white lung icon that works on dark backgrounds -->
                    <img src="https://res.cloudinary.com/dapaxygk0/image/upload/v1753187080/lungs-line.min_i0tfqs.svg" alt="PneumoDetect AI Logo">
                    <h1>PneumoDetect AI</h1>
                </div>
                <div class="content">
                    <h2>Hello {username},</h2>
                    <p>Thank you for signing up for PneumoDetect AI. To complete your registration, please verify your email address by clicking the button below.</p>
                    <div class="button-container">
                        <a href="{verification_link}" class="button">Verify Now</a>
                    </div>
                    <p>If you did not create an account, no further action is required.</p>
                </div>
                <div class="footer">
                    <p><b>Disclaimer:</b> PneumoDetect AI is a tool for informational and research purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</p>
                    <p>&copy; {datetime.now().year} PneumoDetect AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    """

    message = MessageSchema(
        subject="Verify Your PneumoDetect Account",
        recipients=[email],
        body=html_body,
        subtype=MessageType.html
    )
    await fm.send_message(message)


@router.post("/register")
async def register(user: UserCreate, background_tasks: BackgroundTasks):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    existing = await users.find_one({"email": user.email})
    if existing:
        if existing.get("is_verified"):
            raise HTTPException(
                status_code=400, detail="Email is already verified. Please log in.")
        else:
            raise HTTPException(
                status_code=400, detail="Email already registered. Please check your inbox to verify your account.")

    user_id = await get_next_user_id()
    hashed_pw = hash_password(user.password)
    token = str(random.randint(100000, 999999))
    user_doc = UserDB(
        user_id=user_id,
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
        is_verified=False
    ).dict()
    user_doc["verify_token"] = token
    await users.insert_one(user_doc)

    background_tasks.add_task(send_verification_email,
                              user.email, token, user.username)
    return {"msg": "User created. Check your Gmail to verify."}


@router.get("/verify-email")
async def verify_email(email: str, token: str):
    user = await users.find_one({"email": email})
    if not user or user.get("verify_token") != token:
        raise HTTPException(status_code=400, detail="Invalid token or email.")

    await users.update_one({"email": email}, {"$set": {"is_verified": True}, "$unset": {"verify_token": ""}})
    return {"msg": "Email verified. You can now log in."}

@router.post("/login")
async def login(user: UserLogin, response: Response, Authorize: AuthJWT = Depends()):
    db_user = await users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    if not db_user.get("is_verified"):
        raise HTTPException(
            status_code=403, detail="Please verify your email first.")

    set_access_token_cookie(response, Authorize, subject=user.email)
    return {"msg": "Login successful"}

@router.post("/logout")
async def logout(response: Response, Authorize: AuthJWT = Depends()):
    clear_access_token_cookie(response, Authorize)
    return {"msg": "Logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(Authorize: AuthJWT = Depends()):
    """
    Retrieves the details of the currently authenticated user.
    """
    Authorize.jwt_required()

    current_user_email = Authorize.get_jwt_subject()
    user = await users.find_one({"email": current_user_email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user