


import React, { createContext, useContext,useEffect,useState } from 'react'
import {AuthContext} from './AuthProvider'
import {GET_EXPLANATIONS_ENDPOINT,GET_EXPLANATION_ENDPOINT} from '../constants/constants'
import { DisplayContext } from './DisplayProvider';

const HistoricContext = createContext();

const HistoricProvider = ({children}) => {

  const [items, setItems] = useState([])
  const {isLoggedIn, accessTokenRef, loading, login, logout,tryRefresh} = useContext(AuthContext)
  const {graphResponse,set_display} = useContext(DisplayContext)


  function addItem(item){
    //fillHistoric()
    //if (!isLoggedIn) setItems((prevItens)=>[...prevItens,item]);
    setItems((prevItens)=>[...prevItens,item]);
  }

  function removeItem(itemToRemove){
    //console.log(itemToRemove)
    var confirmation = confirm("Delete explanaiton (" +itemToRemove["title"] + ") from historic?");
    if (confirmation){
      setItems(prevItems => prevItems.filter(item => item !== itemToRemove));
      displayLastData(items.filter(item => item !== itemToRemove));
      requestDeleteItem( itemToRemove["_id"] );
    }
  }

  async function requestDeleteItem(id) {
    if (!isLoggedIn || accessTokenRef.current === null) return;

    const url = new URL(GET_EXPLANATION_ENDPOINT);
    url.search = new URLSearchParams({"id":id}).toString();
    try {
      const response = await fetch(url,
        {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessTokenRef.current
          }
        });

      const data = await response.json();

      if (response.ok){ console.log('deleted');}
      else if(response.status === 401 && data["detail"] == "TOKEN_EXPIRED"){
        await tryRefresh();
        return requestDeleteItem(id);
      }
      else console.log('deleted failed');
    } catch (error) {
      console.log('deleted failed');
    }
  }

  async function fillHistoric() {
    console.log('Fill historic')

    if (!isLoggedIn) return;

    try {
      const response = await fetch(GET_EXPLANATIONS_ENDPOINT,
        {
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + accessTokenRef.current
          }
        });
      
      const data = await response.json();
      if (response.ok) {
        setItems(data);
        displayLastData(data);
      }
      else if(response.status === 401 && data["detail"] == "TOKEN_EXPIRED"){
        await tryRefresh();
        return fillHistoric();
      }
      else{
        setItems([]);
      }
    } catch (error) {
      console.log(error)
      setItems([]);
    }
  }

  function displayLastData(data){
    if(data.length > 0){
      const last_item = data[data.length-1];
      set_display(last_item["title"],last_item["explanation"]);
    }else{
      set_display('','');
    }
  }

  useEffect(()=>{fillHistoric();},[isLoggedIn])

  return (
    <HistoricContext.Provider value={{items,addItem,removeItem,setItems}}>
      {children}
    </HistoricContext.Provider>
  )
}

export default HistoricProvider
export {HistoricContext};