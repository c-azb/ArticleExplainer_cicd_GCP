


from fastapi import APIRouter, HTTPException, Depends, status,Response,Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone

from src.API.models import RegisterUserModel
from src.Database.mongodb import insert_user,get_code_meaning,get_user
import os

user_router = APIRouter(
    prefix='/user',
    tags=['user']
)

SECRET_KEY = os.getenv('SECRET_KEY')  # use a strong secret in production!

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 1

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login",auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")#,bcrypt__variant="2y",bcrypt__ident="2b")

@user_router.post('/register')
async def register_user(registration_model:RegisterUserModel):
    user = registration_model.model_dump()
    return_code = insert_user(user,pwd_context)

    if return_code != 0:
        raise HTTPException(status_code=400, detail=get_code_meaning(return_code))
    else:
        return {'result':'Success'}

@user_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)

    if user and pwd_context.verify(form_data.password, user['password']):
        access_token,refresh_token = create_tokens(user['username'])
        response = JSONResponse(content={"access_token":access_token})
        response.set_cookie(key='refresh_token',value=refresh_token,httponly=True,secure=True,
                            samesite="none",
                            max_age=REFRESH_TOKEN_EXPIRE_DAYS*24*60*60,
                            domain=None,#for production set your domain here
                            path="/")
        return response
        #return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=400, detail="Invalid username or password")

@user_router.post("/refresh")
def refresh_token_(request: Request):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Missing refresh token")
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid payload")

        # issue new access token
        new_access_token = create_token({"sub": username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": new_access_token}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@user_router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="none",
    )
    return {"message": "Logged out successfully"}


def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_tokens(username:str):
    access_token = create_token( {"sub":username},timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) )
    refresh_token = create_token( {"sub":username,"type":"refresh"},timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS) )
    return access_token,refresh_token

async def get_current_user(token: str = Depends(oauth2_scheme)) -> RegisterUserModel:
    if token is None:
        return None

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        expire: str = payload.get("exp")
        if not username or not expire:
            raise credentials_exception
        
        user = get_user(username)
        if not user:
            raise credentials_exception
        del user['password']
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="TOKEN_EXPIRED")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")