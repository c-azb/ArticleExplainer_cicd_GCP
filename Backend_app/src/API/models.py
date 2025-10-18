
from pydantic import BaseModel,Field
from datetime import datetime,timezone

class RegisterUserModel(BaseModel):
    username:str
    password:str
    confirm_password:str
    created_at:str = Field(default_factory=lambda: str(datetime.now(timezone.utc).timestamp()) )
    



class StateArguments(BaseModel):
    search_query:str