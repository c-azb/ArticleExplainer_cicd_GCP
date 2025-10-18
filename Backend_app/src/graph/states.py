
from typing import TypedDict
from langchain.docstore.document import Document

class State(TypedDict):
    article_search:str
    article:list[Document]
    current_doc:int
    current_explanation:str

    @staticmethod
    def get_initial_state(article_search:str):
        return State(
            article_search=article_search,
            article=[],
            current_doc=0,
            current_explanation=''
        )