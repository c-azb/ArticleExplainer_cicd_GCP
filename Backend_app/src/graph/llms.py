
#from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq

class LLMs:

    def __init__(self,model_name):
        #self.llm = ChatOllama(model=model_name,base_url='localhost:11434',reasoning=False)
        self.llm = ChatGroq(model=model_name)