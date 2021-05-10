import React,{useState} from 'react'
import { Form,Button } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
import cookie from 'react-cookies'

import {send} from "./userapi/auth"
import {usertempauthenticate} from "./userapi/middleware/userauth"


export default function Login() {


    const [values, setValues] = useState({
        phone:"",
        error: "",
        loading: false,
        didRedirect: false
      });

      const {phone,didRedirect} = values;
      const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
      };


    const performRedirect = () => {
            if(didRedirect)
            return <Redirect to="/otp" />;
        
       
      };

      const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        send({phone}).then((data)=>{
            if(data.err){
                setValues({ ...values, error: data.error, loading: false });
            }
            else{
                
                usertempauthenticate(data,() => {
                    console.log(data);
                    localStorage.setItem("user",JSON.stringify(data.msg));
                    localStorage.setItem("all_data",JSON.stringify(data));
                    localStorage.setItem("temp_userId",JSON.stringify(data.user_temp_id));

                    cookie.save('userId', JSON.stringify(data.user_temp_id));
                    cookie.save('user-temp-id',JSON.stringify(data.msg.temp_userid));
                    
                    //Testing console.log(data);
                    setValues({
                        ...values,
                        didRedirect: true
                      });


                })
                





            }
        })
      }

    return (
        <div>
            <h3 className="text-center mt-5">
                Login / Signup Test
            </h3>
            {performRedirect()}
            <div className="p-5 mt-5">
            <Form>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Phone Number</Form.Label>
    <Form.Control onChange={handleChange("phone")} type="number" placeholder="Enter phone" />
    <Form.Text className="text-muted">
      We'll send OTP code to above Phone.
    </Form.Text>
  </Form.Group>
  <Button variant="outline-danger" type="submit" size="lg" onClick={onSubmit}>
    Send
  </Button>
</Form>
            </div>
        </div>
    )
}
