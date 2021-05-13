import React,{useState,useEffect} from 'react'
import OtpInput from 'react-otp-input';
import { Form,Button,Modal } from 'react-bootstrap';
import {verify} from "./userapi/auth"
import { Redirect ,Link} from 'react-router-dom';
import { userrealauthenticate } from './userapi/middleware/userauth';


export default function OTP() {
    
    const [otp,setOtp] = useState('');
    const [tempId, settempId] = useState()
    const [values, setValues] = useState({
        error: "",
        loading: false,
        didRedirect: false,
        returnto:false,
        iswrong:false,
        needtoComplete:false,
        goToHome:false
      });


      useEffect(() => {
        settempId(localStorage.getItem("tempID"));
      }, [])

     const {error,loading,didRedirect,goToHome,iswrong,needtoComplete,returnto} = values; 
    const handleChange = (event) =>{
        setOtp(event.target.value);
    }

    const onResend = () => {

    }
    const isRetureTo = () => {
        if(returnto)
        return <Redirect to="/login" /> 
    }
    const onRetry = () => {
        setValues({iswrong: false});
    }
    const isWorng = () => {
        if(iswrong){
        return(
            <div className="text-center mt-3">
                <h6>
                Wrong OTP, request for resend
                </h6>
                <Button variant="outline-primary" size="md" block onClick={onResend}>
    Resend
  </Button>
  <Button variant="outline-primary" size="md" block onClick={onRetry}>
    Retry
  </Button>
  
            </div>
        )
        }
    }


    const userneedtoComplete = () => {
        if(needtoComplete){
               return <Redirect to="/profilecomplete"/> 
        }
    }

    const redirectToHome = () => {
        if(goToHome)
        return <Redirect to="/"/> 
    }
    const otpForm = () => {
        if(!iswrong){
           return (<Form className="ml-lg-5">
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Enter the code</Form.Label>
              <Form.Control type="number" placeholder="Enter the OTP" onChange={(text) => handleChange(text)} />
            </Form.Group>
            <Button variant="outline-danger" size="lg" block onClick={onSubmit}>
              Verify
            </Button>
          </Form>)

        }

    }
    const onSubmit = (event) => {
        event.preventDefault();
        verify({otp,tempId}).then((data) => {
            if(data.error){
                setValues({ ...values, error: data.error, loading: false });

            }
            console.log(data);
            if(data.wrong){
                setValues({ ...values, error: data.error, loading: false,iswrong:true });

            }
            else if(data.incomplete){
                setValues({ ...values, error: data.error, loading: false,iswrong:false,needtoComplete:true });

            }
            else if(data.returnto){
                setValues({ ...values, error: data.error, loading: false,iswrong:false,needtoComplete:false,returnto:true });

            }
            else if(data.success){
                userrealauthenticate(data.success, () => {
                    setValues({ ...values, error: data.error, loading: false,iswrong:false,needtoComplete:false,returnto:false, goToHome:true});

                })

            }
        })
    }

    return (
        <div>
           {redirectToHome()}
           {isRetureTo()}
{userneedtoComplete()}
            <div className="mt-5 ml-lg-5" style={{padding:20}}>
         {otpForm()}
{isWorng()}
            </div>

        </div>
    )
}
