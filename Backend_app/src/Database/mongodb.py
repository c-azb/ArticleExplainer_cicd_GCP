
import os
from pymongo.mongo_client import MongoClient
from pymongo import ASCENDING
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from passlib.context import CryptContext


def get_collection():
    client = MongoClient( os.getenv('ARTICLE_EXPLAINER_DB_URI') )
    db = client[os.getenv('DB_NAME')]
    collection = db[os.getenv('USERS_COLLECTION_NAME')]
    return client,collection

def create_indexes():
    client,collection = get_collection()
    collection.create_index( [ ('username',ASCENDING) ],unique=True)
    client.close()

create_indexes()

def insert_user(user_data,pwd_context : CryptContext):
    if not validate_user_register(user_data):
        return 2
    
    user_data['password'] = pwd_context.hash(user_data['password'])
    del user_data['confirm_password']
    
    code = 0

    client,collection = get_collection()
    try:
        collection.insert_one(user_data)
    except DuplicateKeyError:
        code = 1
    client.close()
    return code

def get_user(username):
    client,collection = get_collection()
    user = collection.find_one({'username':username})
    client.close() 
    return user   

def insert_explanation(title,explanation,username):
    client,collection = get_collection()

    new_id = ObjectId()

    collection.update_one(
        {'username':username},
        {'$push': {'explanations': {'_id':new_id,'title':title,'explanation':explanation} } },
        upsert=True
    )
    client.close()
    return str(new_id)

def delete_explanation(username,id):
    client,collection = get_collection()
    collection.update_one(
        {'username':username},
        {'$pull': {'explanations': {'_id':ObjectId(id)} } }
    )
    client.close()
    return 0


def get_code_meaning(code:int):
    if code == 0:
        return 'Success'
    elif code == 1:
        return 'Username already exists.'
    elif code==2:
        return 'Invalid credentials'
    
    return 'Unkown'


import re
def validate_username(username:str):
    match_ = re.match(r'\w+',username)
    if match_ is None:
        return False
    if len(username) < 3 or len(username) > 15 or match_.group(0) != username:
        return False
    return True

def validate_password(psw:str,confirm_psw:str):
    match_ = re.match(r'\w+',psw)
    if match_ is None:
        return False
    if len(psw) < 3 or len(psw) > 15 or match_.group(0) != psw or psw != confirm_psw:
        return False
    return True

def validate_user_register(user_data):
    return validate_username(user_data['username']) and validate_password(user_data['password'],user_data['confirm_password'])
    
