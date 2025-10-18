
# from dotenv import load_dotenv #not needed for deployment
# if not load_dotenv(): print("Failed loading dotenv") 

from fastapi import FastAPI
from src.API.Routers import graph_router
from src.API.Routers import user_router

app = FastAPI()

import os
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('ALLOW_ORIGINS').split(), #use "*" for any or the website url hosted in prduction... "http://localhost:5173","http://127.0.0.1:5173"
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

app.include_router(graph_router.graph_router)
app.include_router(user_router.user_router)

@app.get("/")
def welcome():
    return {"msg":"Welcome to article explainer app"}

#uvicorn main:app --reload
# if __name__=="__main__":
#     import uvicorn
#     uvicorn.run(app,host="127.0.0.1",port=8000)