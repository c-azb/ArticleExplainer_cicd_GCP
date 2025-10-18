

import { createContext,useState } from 'react'

const DisplayContext = createContext();

const DisplayProvider = ({children}) => {

    const [graphResponse,setGraphResponse] = useState({"title":"","explanation":""});

    function reset_display(){
        setGraphResponse({"title":"","explanation":""})
    }
    function set_display(title,explanation){
        setGraphResponse({"title":title,"explanation":explanation})
    }
    

  return (
    <DisplayContext.Provider value={{graphResponse,set_display,reset_display}}>
        {children}
    </DisplayContext.Provider>
  )
}

export default DisplayProvider
export {DisplayContext};