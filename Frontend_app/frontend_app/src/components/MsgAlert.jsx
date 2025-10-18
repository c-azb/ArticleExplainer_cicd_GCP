

const MsgAlert = ( {msg,type} ) => {
    return (
        <>
        {type == 'error'? 
        (<div className="alert alert-danger m-2" role="alert">{msg}</div>):
        (<div className="alert alert-success m-2" role="alert">{msg}</div>)}
            
        </>
    )
}

export default MsgAlert