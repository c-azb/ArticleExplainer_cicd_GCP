

import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faEye } from '@fortawesome/free-solid-svg-icons'
import {HistoricContext} from './HistoricProvider'
import {DisplayContext} from './DisplayProvider'


const SideBarItem = ({itemData}) => {

    const {items,addItem,removeItem} = useContext(HistoricContext)
    const {graphResponse,set_display} = useContext(DisplayContext)
    
    function viewItem(data,setResponse){
        setResponse(data["title"],data["explanation"])
    }
    function deleteItem(data){
        removeItem(data)
    }

  return (
    <>
    <div>
        <hr />
        <span>{itemData["title"]}</span>
        <button onClick={()=>deleteItem(itemData)} className='p-2 btn btn-danger float-end'><FontAwesomeIcon icon={faTrash} /></button>
        <button onClick={()=>viewItem(itemData,set_display)} className='p-2 me-1 btn btn-success float-end'><FontAwesomeIcon icon={faEye} /></button>
        <hr />
    </div>
    </>
    // <button onClick={()=>onClickItem(itemData,setGraphResponse)} className='btn btn-outline-light child-element w-100'> {itemData["title"]} </button>
  )
}

export default SideBarItem