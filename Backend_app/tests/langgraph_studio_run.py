
import os
import sys
sys.path.append(os.path.abspath('../../Backend_app'))
from src.graph.main_graph import MainGraph
from src.graph.states import State

from dotenv import load_dotenv
load_dotenv('../.env')
#os.environ["LANGSMITH_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")

main_graph = MainGraph(model_name='llama3.2:3b')
graph = main_graph.graph


#debugging with langgraph studio:
    # open terminal
    # cd to same langgraph.json path
    # langgraph dev   