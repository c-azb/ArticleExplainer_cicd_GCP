

import { useContext } from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from './AuthProvider'
import {HistoricContext} from './HistoricProvider'
import { useNavigate } from 'react-router-dom'
import {DisplayContext} from './DisplayProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  //const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const {isLoggedIn, accessTokenRef, loading, login,logout} = useContext(AuthContext);
  const {items,addItem,removeItem,fillHistoric,setItems} = useContext(HistoricContext);
  const {graphResponse,set_display,reset_display} = useContext(DisplayContext);

  const navigate = useNavigate()

  const onClickLogout = async () => {
    setItems([]);
    reset_display();
    await logout();
    navigate('/');
  }

  return (

    <>
      <header>
      
          <div className="navbar bg-secondary p-3">
            
            <div className="container-fluid">
             
              <Link to="/" className='navbar-brand text-white fw-bold'>
              <h2>Article Explainer</h2>
              </Link>

               
               <div className="d-flex">
              {isLoggedIn ? 
              (<button onClick={onClickLogout} className='btn btn-primary' disabled={loading}>{loading ? (<FontAwesomeIcon icon={faSpinner} spin />):null} Logout</button>) 
              :
              !loading ? 
              (<Link to="/LoginOrRegister" className='btn btn-primary'>Login</Link>):null}
              </div>

            </div>
            

          </div>

      </header>


    </>

  )
}

export default Header