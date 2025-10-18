
import React, { useContext, useState } from 'react'
import { LOGIN_API_ENDPOINT, REGISTER_API_ENDPOINT } from '../constants/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import MsgAlert from './MsgAlert'
import {useNavigate} from 'react-router-dom'
//import '@fortawesome/fontawesome-svg-core/styles.css';
import {AuthContext} from './AuthProvider'
import {HistoricContext} from './HistoricProvider'

const LoginOrRegister = () => {

    const [usernameLogin, setUsernameLogin] = useState('');
    const [pswLogin, setpswLogin] = useState('');

    const [usernameRegister, setUsernameRegister] = useState('');
    const [pswRegister, setpswRegister] = useState('');
    const [pswConfRegister, setpswConfRegister] = useState('');

    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingin, setIsLoggingin] = useState(false);

    const [alertMsg, setAlertMsg] = useState({ 'type': 'none', 'msg': '' });

    const navigate = useNavigate()

    const {isLoggedIn, accessTokenRef, loading, login} = useContext(AuthContext)    

    async function onClickLogin(e) {
        e.preventDefault();
        setIsLoggingin(true);
        await login(usernameLogin,pswLogin);
        
        setIsLoggingin(false);
        if (!isLoggedIn){
            setAlertMsg({ 'type': 'error', 'msg': 'Failed to login' });
        }
    }

    async function onClickRegister(e) {
        e.preventDefault();
        setIsRegistering(true);

        const data_ = {
            'username': usernameRegister,
            'password': pswRegister,
            'confirm_password': pswConfRegister
        };

        try {
            const response = await fetch(REGISTER_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data_)
            });
            setpswRegister('');
            setpswConfRegister('');
            if (response.ok) {
                setUsernameRegister('');
                setAlertMsg({ 'type': 'success', 'msg': 'Successfully registered!' })
            }
            else {
                const data = await response.json();
                console.log('Errror', data);
                setAlertMsg({ 'type': 'error', 'msg': 'Register failed' })
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMsg({ 'type': 'error', 'msg': 'Register failed' })
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <>
            {alertMsg['type'] != 'none' ?
                (<MsgAlert msg={alertMsg['msg']} type={alertMsg['type']} />) : null}

            <div className="row m-2">

                <div className="col-5 m-2">

                    <h2 className='mb-2'>Login</h2>
                    <form onSubmit={onClickLogin}>
                        <div className='mb-2'>
                            <input type="text" placeholder='Username' className='form-control' value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} />
                        </div>
                        <div className='mb-2'>
                            <input type="password" placeholder='Password' className='form-control' value={pswLogin} onChange={(e) => setpswLogin(e.target.value)} />
                        </div>

                        {isLoggingin ?
                            (<button className='btn btn-primary' disabled><FontAwesomeIcon icon={faSpinner} spin /> Login in...</button>) :
                            isRegistering ?
                                (<button className='btn btn-primary' disabled>Login</button>) :
                                (<button type='submit' className='btn btn-primary'>Login</button>)
                        }

                    </form>
                </div>

                <div className="col-6 m-2">
                    <h2>Register</h2>
                    <form onSubmit={onClickRegister}>
                        <div className='mb-2'>
                            <input type="text" placeholder='Username' className='form-control' value={usernameRegister} onChange={(e) => setUsernameRegister(e.target.value)} />
                        </div>
                        <div className='mb-2'>
                            <input type="password" placeholder='Password' className='form-control' value={pswRegister} onChange={(e) => setpswRegister(e.target.value)} />
                        </div>
                        <div className='mb-2'>
                            <input type="password" placeholder='Confirm Password' className='form-control' value={pswConfRegister} onChange={(e) => setpswConfRegister(e.target.value)} />
                        </div>
                        {isRegistering ?
                            (<button className='btn btn-primary float-end' disabled><FontAwesomeIcon icon={faSpinner} spin /> Register in...</button>) :
                            isLoggingin ?
                                (<button className='btn btn-primary float-end' disabled>Register</button>) :
                                (<button type='submit' className='btn btn-primary float-end'>Register</button>)
                        }
                    </form>
                </div>

            </div>



        </>
    )
}

export default LoginOrRegister