import React,{useState} from 'react'
import { Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

export default function Logout() {

    const [toHomeHere, settoHome] = useState(false);

    const toHome = () => {
        if(toHomeHere)
        return <Redirect to="/"/>
    }
    const onLogout = () => {
        window.localStorage.clear();
        settoHome(true)
    }

    return (
        <div>
            <h3>
                Logout
            </h3>
            {toHome()}
            <Button variant="outline-success" onClick={onLogout}>Logout</Button>
        </div>
    )
}
