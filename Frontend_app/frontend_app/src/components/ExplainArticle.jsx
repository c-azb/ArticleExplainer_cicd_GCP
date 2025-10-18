import React, { useContext, useEffect, useState } from 'react'
import { REQUEST_GRAPH_ENDPOINT } from '../constants/constants'
import { AuthContext } from './AuthProvider'
import SideBar from './SideBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { HistoricContext } from './HistoricProvider'
import { DisplayContext } from './DisplayProvider'

import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'

const ExplainArticle = () => {

    const { isLoggedIn, accessTokenRef, loading, login, logout, tryRefresh } = useContext(AuthContext)
    const { items, addItem } = useContext(HistoricContext)
    const { graphResponse, set_display } = useContext(DisplayContext)

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('1706.03762');

    async function requestArticleExplanation(e) {
        e.preventDefault();
        setIsLoading(true);
        await requestExplanation();
    }

    const requestExplanation = async () => {

        if (searchQuery.trim().length === 0) {
            alert("Input should not be empty");
            setIsLoading(false);
            return;
        }

        let headers = { "Content-Type": "application/json" };
        if (isLoggedIn) {
            headers = { "Content-Type": "application/json", "Authorization": "Bearer " + accessTokenRef.current };
        }

        try {
            const response = await fetch(REQUEST_GRAPH_ENDPOINT, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 'search_query': searchQuery })
            });
            const data = await response.json();
            if (response.ok) {
                set_display(data['title'], data['explanation']);//setGraphResponse(data)
                addItem(data);
                setSearchQuery('')
            } else if (response.status === 401 && data["detail"] == "TOKEN_EXPIRED") {
                await tryRefresh();
                if (accessTokenRef.current !== null) return requestExplanation();
            }
            // console.log(data);

        } catch (error) {
            console.log(error)

        } finally {
            setIsLoading(false);
        }
    }



    return (
        <>
            <div >
                <div className="row gx-0">
                    {/* {isLoggedIn ? (<div className="col-auto mt-1 ms-1"><SideBar/></div>) : null} */}
                    <div className="col-auto mt-1 ms-1"><SideBar /></div>

                    <div className="col m-5">                 
                        <h6 className='text-center mb-3'>Welcome to article explainer! You can find articles to search at <Link to="https://arxiv.org/" target="_blank">arxiv.org</Link> or try using keywords!</h6>
                       
                        <form onSubmit={requestArticleExplanation}>
                            <div className="input-group">
                                <input className='form-control' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id='search-input' type="text" />

                                {isLoading ?
                                    (<button className='btn btn-primary' disabled><FontAwesomeIcon icon={faSpinner} spin /> Searching </button>) :
                                    (<button className='btn btn-primary' type='submit'>Search</button>)
                                }

                            </div>
                        </form>

                        {graphResponse["title"] != '' ? (
                            <div className='m-5'>
                                <h3>{graphResponse["title"]}</h3>
                                <div className='border rounded-1 p-3' ><ReactMarkdown>{graphResponse["explanation"]}</ReactMarkdown></div>

                            </div>) : null
                        }
                    </div>

                </div>

            </div>


        </>

    )
}

export default ExplainArticle