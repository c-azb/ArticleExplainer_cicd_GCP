
from langgraph.graph import StateGraph,START,END
from src.graph.states import State
from src.graph.llms import LLMs
from src.graph.nodes import Nodes

class MainGraph:

    def __init__(self,model_name):
        

        graph = StateGraph(State)

        llms =  LLMs(model_name)
        nodes = Nodes(llms=llms)

        graph.add_node('get_article_node',nodes.get_article_node)
        graph.add_node('explainer_node',nodes.explainer_node)

        graph.add_edge(START,'get_article_node')
        graph.add_conditional_edges('get_article_node',
                                    nodes.explain_condition,
                                    {
                                        'explain_chunk':'explainer_node',
                                        '__end__':END
                                    })
        graph.add_conditional_edges('explainer_node',
                            nodes.explain_condition,
                            {
                                'explain_chunk':'explainer_node',
                                '__end__':END
                            })
        
        self.graph = graph.compile()
        self.nodes=nodes

    def invoke(self,article_search):
        res = self.graph.invoke( State.get_initial_state(article_search=article_search) )

        title = None
        if len(res['article']) > 0:
            title = res['article'][0].metadata['Title']
        
        return res['current_explanation'],title

        
