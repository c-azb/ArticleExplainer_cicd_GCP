

from fastapi import APIRouter,Depends,HTTPException,status
from src.API.models import StateArguments
#from src.graph.main_graph import MainGraph
from src.API.Routers.user_router import get_current_user
from src.Database.mongodb import insert_explanation,delete_explanation

graph_router = APIRouter(
    prefix='/graph',
    tags=['graph'],
    #dependencies=[]
)

@graph_router.post('')
async def invoke_graph(state_arguments:StateArguments,user = Depends(get_current_user) ):

    if len(state_arguments.search_query.strip()) == 0:
        raise HTTPException(status_code=400,detail="Search query should be a non empy string.")
    
    from src.graph.main_graph import MainGraph
    main_graph = MainGraph(model_name='llama-3.1-8b-instant')
    main_graph.nodes.print_progress = True
    main_graph.nodes.limit_pages = 2
    response,title = main_graph.invoke(article_search=state_arguments.search_query)
    if user is not None:
        new_id = insert_explanation(title,response,user['username'])
    else: new_id = '0'

    return {'explanation':response,'title':title,'_id':new_id}

@graph_router.get('/explanations')
async def get_explanations(user = Depends(get_current_user)):
    if user is not None:
        if 'explanations' in user:
            for explanation in user['explanations']:
                explanation['_id'] = str(explanation['_id'])
            return user['explanations']
        else: return []
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User is not logged in.")

@graph_router.get('/explanation')
async def get_explanation(id:str,user = Depends(get_current_user)):
    if user is not None:
        explanation = get_explanation_by_id(id,user)
        if explanation:
            explanation['_id'] = str(explanation['_id'])
            return explanation
        else:
            raise HTTPException(status_code=400, detail="Explanation not found")
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User is not logged in.")

@graph_router.delete('/explanation')
async def delete_explanation_(id:str,user = Depends(get_current_user)):
    if user is not None:
        if get_explanation_by_id(id,user) is not None:
            delete_explanation(user['username'],id)
            return {}
        else:
            raise HTTPException(status_code=400, detail="Explanation not found")
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="User is not logged in.")

def get_explanation_by_id(id:str,user):
    if 'explanations' in user:
        for explanation in user['explanations']:
            if id == str(explanation['_id']):
                return explanation
    return None