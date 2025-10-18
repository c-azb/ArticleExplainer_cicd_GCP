
from src.graph.llms import LLMs
from src.graph.states import State
from typing import Literal
from langchain_core.messages import SystemMessage,HumanMessage,AIMessage
#from langchain_community.document_loaders import ArxivLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

import arxiv
from langchain_community.document_loaders import PyPDFLoader
import os

class Nodes:
    def __init__(self,llms:LLMs):
        self.llms=llms
        self.debug=False
        self.limit_pages = None
        self.print_progress = False

    def get_article_node(self,state:State):
        # loader = ArxivLoader(query=state['article_search'], load_max_docs=1,top_k_results=1)
        # docs = loader.load()
        client = arxiv.Client()
        try:
            float(state['article_search'])
            search = arxiv.Search(id_list=[state['article_search']])
        except:
            search = arxiv.Search(query=state['article_search'],max_results=1,sort_by=arxiv.SortCriterion.Relevance)
        try:
            paper = next(client.results(search))
            title_ = paper.title
            tmp_file = f'{title_}.pdf'
            tmp_path = f"/tmp/{tmp_file}" 
            paper.download_pdf(dirpath="/tmp",filename=tmp_file) #./tmp is the only allowed write path on AWS Lambda
            loader = PyPDFLoader(tmp_path,mode='single')  # uses pdfminer.six internally
            docs = loader.load()
            docs[0].metadata['Title'] = paper.title
            os.remove(tmp_path)
        except:
            print('Paper not found')
            return { 'article':[] }
        
        text_splitter = RecursiveCharacterTextSplitter(separators=['.\n','\n\n'],chunk_size=5000,chunk_overlap=200)
        splitted_docs = text_splitter.split_documents(docs)
        self.debug_node('get_article_node',input=state['article_search'],output=f"{len(splitted_docs)} chunks Title: {splitted_docs[0].metadata['Title']}")
        if self.limit_pages:
            splitted_docs = splitted_docs[:self.limit_pages]
        
        return { 'article':splitted_docs }

    def explainer_node(self,state:State):
        current_chunk = state['current_doc']
        total_chunks = len(state['article'])

        msgs = [
            SystemMessage((
                'You are an article explainer. '
                'You will receive an article chunk and the previous explanation you provided.\n'
                'You must rewrite the previous explanation to include also the current chunk explanation '
                'until the entire article is explained.\n' \
                'The explanation must be in simple words, short and easy to understand.\n'
                'You can ignore references sections.\n'
                'Use summarization techniques to keep the explanation shorter.\n' \
                'Answer in markdown format.'
                )),
        ]
        if len(state['current_explanation']) > 0: msgs.append(AIMessage(state['current_explanation']))
        msgs.append(HumanMessage(
                (f'Chunk {current_chunk+1} of {total_chunks}:\n'
                 f"{state['article'][current_chunk].page_content}")
            )
        )

        res = self.llms.llm.invoke(msgs).content

        if self.print_progress: print(f'Progress: {(current_chunk+1)/total_chunks * 100}%')

        self.debug_node(f'explainer_node : iteration {current_chunk+1}',input=msgs,output=res,title_color='\033[32m')
        return {'current_explanation':res,'current_doc':current_chunk+1}
    
    def explain_condition(self,state:State) ->Literal['explain_chunk','__end__'] :
        if state['current_doc'] >= len(state['article']):
            self.debug_node(f'explain_condition',input=None,output='__end__')
            return '__end__'
        self.debug_node(f'explain_condition',input=None,output='explain_chunk')
        return 'explain_chunk'
    

    def debug_node(self,title,input,output,title_color='\033[36m'):
        if self.debug:
            print(f'\033[1m{title_color}============ {title} ============\033[0m\033[0m')
            self.print_debug(input,'INPUT')
            self.print_debug(output,'OUTPUT')

    def print_debug(self,value,title):
        if value:
            print(f'\033[1m\033[34m===== {title} =====\033[0m\033[0m')
            if isinstance(value,list) and hasattr(value[0],'pretty_print'):
                for msg in value: msg.pretty_print()
            else:
                print(str(value))
        

