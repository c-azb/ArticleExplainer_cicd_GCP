

import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
// import { GET_EXPLANATIONS_ENDPOINT } from '../constants/constants'
import {HistoricContext} from './HistoricProvider'
import SideBarItem from './SideBarItem'

const SideBar = () => {

  const {items} = useContext(HistoricContext)

  return (
    <>
      <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className="offcanvas offcanvas-start sidebar" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">Article Explanations</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          

          <div id="sidebar_content" className='p-2 border rounded-2'>

            {
              items.map((item,idx) => (
                 <SideBarItem key={idx} itemData={item}/>
              ))
            }
          </div>

        </div>
      </div>

    </>
  )
}

export default SideBar