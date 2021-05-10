import React,{useState,useEffect} from 'react'
import OtpInput from 'react-otp-input';
import { Form,Button,Modal } from 'react-bootstrap';
import {verify} from "./userapi/auth"
import { Redirect } from 'react-router-dom';


export default function OTP() {
    
    const [otp,setOtp] = useState('');
    const [tempId, settempId] = useState()
    const [values, setValues] = useState({
        error: "",
        loading: false,
        didRedirect: false,
        iswrong:false,
        needtoComplete:false
      });


      useEffect(() => {
        settempId(localStorage.getItem("temp_userId"));
      }, [])

     const {error,loading,didRedirect,iswrong,needtoComplete} = values; 
    const handleChange = (event) =>{
        setOtp(event.target.value);
    }

    const onResend = () => {

    }
    const isWorng = () => {
        if(iswrong){
        return(
            <div className="text-center mt-3">
                <h6>
                Wrong OTP, request for resend
                </h6>
                <Button variant="outline-primary" size="lg" block onClick={onResend}>
    Resend
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
            if(data.emsg){
                setValues({ ...values, error: data.error,iswrong:true, loading: false });

            }

            if(data.profilestatus){
                setValues({ ...values, error: data.error,iswrong:false, loading: false,needtoComplete:true });

            }
            else{
                console.log(data);
            }
        })
    }

    return (
        <div>
           
{userneedtoComplete()}
            <div className="mt-5 ml-lg-5" style={{padding:20}}>
         {otpForm()}
{isWorng()}
            </div>

        </div>
    )
}
