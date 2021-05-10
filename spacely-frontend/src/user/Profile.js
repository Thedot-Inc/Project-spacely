import React,{useState,useEffect} from 'react'
import {Form,Button} from 'react-bootstrap';
import Map from "mapmyindia-react";
import ImageUploader from 'react-images-upload';

import firebase from 'firebase/app'
import 'firebase/storage'

import {profile} from "./userapi/profile"
import { Redirect } from 'react-router-dom';
import { usertempauthenticate } from './userapi/middleware/userauth';


// const firebaseConfig = {
//     apiKey: "AIzaSyB_vzl-xdVLcpGagOMRK4g0Fj0F6nCVuoo",
//     authDomain: "spacely-user.firebaseapp.com",
//     projectId: "spacely-user",
//     storageBucket: "spacely-user.appspot.com",
//     messagingSenderId: "78178919942",
//     appId: "1:78178919942:web:ecfdf774593e1af5ebc587",
//     measurementId: "G-ZDEL4NK9N0"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);




export default function Profile() {

    const [latitude,setLatitude] = useState("");
    const [longitude,setLongitude] = useState("");
  
    const [ulocation, setulocation] = useState("");
    const [isredirect, setisredirectn] = useState(false);

    const [doneLocation, setdoneLocation] = useState(false);
    const [pictures, setPictures] = useState([]);

    const [temp_userid, settemp_userid] = useState('');


    const [values, setValues] = useState({
        name:"",
        email:"",
        aadhar:"",
        error: "",
        loading: false,
        didRedirect: false
      });


      useEffect(() => {
        settemp_userid(localStorage.getItem('temp_userId'));
      }, [])

      const onHandler  = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
      }
      const { name, error, loading, didRedirect,email ,aadhar} = values;
    const onDrop = picture => {
      setPictures([...pictures, picture]);
      console.log(picture);
    };


const uploadProfilePic =() => {
    
}


const doRiredict = () => {
    if(didRedirect)
    return <Redirect to="/" />
}

const onCompleteProfile = (event) => {
    event.preventDefault();
    const location = [latitude,longitude]
    profile({name,email,aadhar,temp_userid,location}).then((data) => {
        if(data.error){
            setValues({ ...values, error: data.error, loading: false });

        }
        else{
            console.log(data);
            window.localStorage.clear();
            usertempauthenticate(data, () => {
                setValues({ ...values, error: '', loading: false,didRedirect:true });

            })
          


        }
    })
}

    const userProfile = () => {
        if(doneLocation){
            return(
                <Form className="mt-5">
                        <ImageUploader
                withIcon={true}
                buttonText='Choose profile'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
            <Button variant="danger" size="md" block onClick={uploadProfilePic}>
    Upload profile pic
  </Button>
            <div className="p-2 mt-5">
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" onChange={onHandler("name")}/>
                
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" onChange={onHandler("email")}/>
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Aadhar</Form.Label>
                    <Form.Control type="text" placeholder="Enter the aadhar" onChange={onHandler("aadhar")}/>
                  </Form.Group>
              
                  <Button variant="outline-dark" size="md" block type="submit" onClick={onCompleteProfile}>
                    Submit
                  </Button>
                  </div>
                </Form>
                        )
        }
   
    }
    const handleLocationError  =(error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
            default:
              alert("An unknown error accurder type ur address manually");
        }
      }
    const mapLocation = () => {
        if(latitude =="" && longitude=="" && !doneLocation){
            return(
                <div>
                <Map
                      height='500px'
                      markers={[
                          {
                              position: [18.5314, 73.845],
                              draggable: true,
                              title: "Marker title",
                              onClick: e => {
                                  console.log("clicked ");
                              },
                              onDragend: e => {
                                  console.log("dragged");
                              }
                          }
                      ]}
                      />
                        <Button variant="outline-danger" size="lg" block className="mt-3" onClick={getGLocation}>
                                Get My Location
                        </Button>
                      </div>
            )
        }
        else if(!doneLocation){
            return(
                <div>
                <Map
            markers={[
              {
                position: [latitude, longitude],
                zoomControl: true,
                draggable: true,
                title: "Your Location",
                onClick: e => {
                  console.log("clicked ");
                },
                onDragend: e => {
                  console.log("dragged");
                }
              }
            ]}
            center={[latitude, longitude]}
    
          />

<Button variant="outline-danger" size="lg" block className="mt-3" onClick={fixLocation}>
                                Fix my location
                        </Button>
          </div>
            )
        }

    }

    const fixLocation = () => {
        const user_location = {latitude,longitude}
        localStorage.setItem("location",JSON.stringify(user_location));
        setdoneLocation(true);
    }

    const getGLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getCoordinates,handleLocationError);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }
      const getCoordinates = (position) => {
        console.log(position.coords.latitude)
        setLatitude(position.coords.latitude)
        console.log(position.coords.longitude)
        setLongitude(position.coords.longitude)
    
      }

    return (
        <div>
            {doRiredict()}
            <h3>
                User need to complete profile
            </h3>
            <div className="p-2">
                {userProfile()}
            {mapLocation()}
            </div>
        </div>
    )
}
