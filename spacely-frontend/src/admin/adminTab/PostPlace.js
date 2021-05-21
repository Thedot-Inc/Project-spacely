import React,{useState} from 'react'
import {Form,Button,Col,Row,Image} from 'react-bootstrap'
import {FilePicker,Heading,UnorderedList,ListItem,TickCircleIcon,Spinner,TrashIcon,Alert,BanCircleIcon,Badge,Pane,Text} from 'evergreen-ui'
import { RadioGroup, RadioButton,ReversedRadioButton } from 'react-radio-buttons';
import firebase from 'firebase/app'
import 'firebase/storage'
import { postPlace } from '../adminApi/postPlace';

import { v4 as uuidv4 } from 'uuid';


const firebaseConfig = {
  apiKey: "AIzaSyB_vzl-xdVLcpGagOMRK4g0Fj0F6nCVuoo",
  authDomain: "spacely-user.firebaseapp.com",
  databaseURL: "https://spacely-user-default-rtdb.firebaseio.com",
  projectId: "spacely-user",
  storageBucket: "spacely-user.appspot.com",
  messagingSenderId: "78178919942",
  appId: "1:78178919942:web:ecfdf774593e1af5ebc587",
  measurementId: "G-ZDEL4NK9N0"
};
  // Initialize Firebase

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }else {
    firebase.app(); // if already initialized, use that one
 }


export default function PostPlace() {

  const [files, setFiles] = useState([]);

  const [progress, setProgress] = useState(false);
  const [warehousePicStatus, setwarehousePicStatus] = useState(false)


  const [plot3D, setPlot3D] = useState(null);
  const [progress3d, setprogressed] = useState(false);
  const [plot3DStatus, setplot3DStatus] = useState(false);


  // Picture Links
  const [warehouseUrls,setWarehouseUrls] = useState([]);

  const [downloadURL, setdownloadURL] = useState(null)


// *********************************** Here states of fields *********************************
//TODO need to work on poestedbyWhome and landverication
// const [landverify, setlandverify] = useState('');
// const [postedBy, setpostedBy] = useState('');


// const [name, setname] = useState('');
// const [address, setaddress] = useState('');
// const [area, setarea] = useState('');
// const [population, setpopulation] = useState('');
// const [rent, setrent] = useState('');
// const [nopartition, setnopartition] = useState('');
// const [maxpartition, setmaxpartition] = useState('');
// const [ownername, setownername] = useState('');
// const [aadhaar, setaadhaar] = useState('');

// const [ownerAddress, setownerAddress] = useState('');
// const [watsappNo, setwatsappNo] = useState('');
// const [phone2, setphone2] = useState('');
// const [ownerEmail, setownerEmail] = useState('');
// const [notes, setnotes] = useState('');


const [values,setValues] = useState({
  name:"",
  address:"",
  area:"",
  aadhaar:"",
  population:"",
  rent:"",
  nopartition:"",
  maxpartition:"",
  ownername:"",
  owneraddress:"",
  watsappNo:"",
  phone2:"",
  ownerEmail:"",
  notes:"",
  latitude:"",
  longitude:"",

})

//




const onChangeHandler = name => event => {
  setValues({...values, [name]: event.target.value})
}


  const { name,
  address,
  area,
  aadhaar,
  population,
  rent,
  nopartition,
  maxpartition,
  ownername,
  owneraddress,
  watsappNo,
  phone2,
  ownerEmail,
  latitude,
  longitude,
  notes} = values;



const onFileChange = e => {
 for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
   // add an "id" property to each File object
      setFiles(prevState => [...prevState, newFile]);
    }
  };


  const handle3DChange = (e) =>{
    setPlot3D(e.target.files[0])
  }
    // console.log(e.target.files[0])
    const handle3DUpload = (e) =>{
      // console.log(this.state.image);
    e.preventDefault(); // prevent page refreshing

      let file = plot3D;
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child(`spacely/warehouse3D/spacely_club${uuidv4()}/${file.name}`).put(file);
    
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>{
          var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
          setprogressed(true)
        },(error) =>{
          throw error
        },() =>{
          // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{
    
          uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
            setdownloadURL(url)
            setprogressed(false)
            setplot3DStatus(true);
          })
    
       }
     ) 
    }


  const onUploadSubmission = e => {
    const uploadUrls = [];
    e.preventDefault();                                 //   prevent page refreshing
      const promises = [];
      setProgress(true);
      files.forEach(file => {
       const uploadTask = 
        firebase.storage().ref().child(`spacely/warehouse/spacely_club${uuidv4()}/${file.name}`).put(file);
          promises.push(uploadTask);
          uploadTask.on(
             firebase.storage.TaskEvent.STATE_CHANGED,
             snapshot => {
              const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                 if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                  console.log(`Progress: ${progress}%`);
                  
                 }
               },
               error => console.log(error.code),
               async () => {
                 const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                  // do something with the url

                  console.log('downloadURL - > ',downloadURL);
                  uploadUrls.push(downloadURL);

                }
               );
             });
         Promise.all(promises)
          .then(() => {
              console.log("uploadUrls : ",uploadUrls);
              console.log("uploadUrls type : ",typeof uploadUrls);

              setWarehouseUrls({uploadUrls});
              setProgress(false);
              setwarehousePicStatus(true);
              // warehouseUrls.map((i,p) => {
              //   console.log(`Here is the files ${i} ${p}`);
              // })
      }
        
          )
          .catch(err => console.log(err.code));
   }
   

    const handleFeatures = () => {

    }

    const onSubmitDummyPic = () => {
      const location = [latitude,longitude]
  postPlace({name,
    address,
    area,
    aadhaar,
    population,
    rent,
    nopartition,
    maxpartition,
    ownername,
    owneraddress,
    location,
    watsappNo,
    phone2,
    ownerEmail,
    notes,
    warehouseUrls,
    downloadURL}).then((data) => {
      console.log(data);
        if(data.adminerror){
            // setValues({...values,name:"",address:"",
            //   area:"",
            //   aadhaar:"",
            //   population:"",
            //   rent:"",
            //   nopartition:"",
            //   maxpartition:"",
            //   ownername:"",
            //   owneraddress:"",
            //   watsappNo:"",
            //   phone2:"",
            //   ownerEmail:"",
            //   latitude:"",
            //   longitude:"",
            //   notes:""})
          return(
<Pane>
<Alert intent="danger" 
    title="We weren’t able to save your changes"
  >
    We have some server problem, please inform Server Admin
  </Alert>
</Pane>

          )
        }

        else if(data.msg && data.success){
          // setValues({...values,name:"",address:"",
          //   area:"",
          //   aadhaar:"",
          //   population:"",
          //   rent:"",
          //   nopartition:"",
          //   maxpartition:"",
          //   ownername:"",
          //   owneraddress:"",
          //   watsappNo:"",
          //   phone2:"",
          //   ownerEmail:"",
          //   latitude:"",
          //   longitude:"",
          //   notes:""})
        return(
<Pane>
<Alert
    intent="success"
    title="Your Post is scuccessfully uploaded"
    marginBottom={32}
  />
</Pane>

        )
      }
  })

    }
     
    const renderTheFileName = () => {
      

        warehouseUrls.map((i,p) => {
          return (
            <ul>
             Here is the files you has uploaded: {i} {p}
            </ul>
          )
        })
      
      }

    return (
        <div className="mb-5">
                <Heading size={700} marginTop={40}>
    Fill Place Details
  </Heading>
  <div>
  <UnorderedList>
  <ListItem icon={TickCircleIcon} iconColor="success">
    Upload Warehouse pictures first
  </ListItem>
  <ListItem icon={TickCircleIcon} iconColor="success">
    Fill out all the form without missing any
  </ListItem>
  <ListItem icon={BanCircleIcon} iconColor="danger">
    Don't submit without Uploading the image
  </ListItem>
  <ListItem icon={BanCircleIcon} iconColor="danger">
    Verify before submitting 
  </ListItem>
</UnorderedList>
  </div>
      <div>
        <p>

        </p>
      </div>
            <div className="mt-5">
              {warehousePicStatus === false ? (
                <div>


<Form>
  <Form.Group>
    <Form.File type="file" multiple id="exampleFormControlFile1" label="Example file input"onChange={onFileChange}/>
  </Form.Group>
</Form>

{progress ? (
  <div>

<Pane>
  <Spinner marginX="auto" marginY={120} />
</Pane>
</div>
)
:(
  <div>
<Button marginY={8} marginRight={12} iconBefore={TrashIcon} className="mt-3 auto-ml" onClick={onUploadSubmission}>
        Upload
      </Button>


    </div>
)

}
                  </div>
              ):(
null
              )

              }
   

      
            </div>
    
      {warehousePicStatus ? (
        <div>
          {
            <div>
                <Pane display="flex" alignItems="center" marginBottom={16}>
    <Pane flexBasis={120}>
      <Badge color="green">Success</Badge>
    </Pane>
    <Pane>
      <Text>  Warehouse picture uploaded success, Move on to other</Text>
    </Pane>
  </Pane>
     
          </div>
          }
          </div>
      ):(
        <div className="mt-4 text-center">
          <hr/>
          <Pane display="flex" alignItems="center" marginBottom={16}>
    <Pane flexBasis={120}>
      <Badge color="blue">Warehouse Pic</Badge>
    </Pane>
    <Pane>
      <Text>Still yet to upload</Text>
    </Pane>
  </Pane>
  <hr/>
        </div>
      )

      }
            <div className="mt-4">
            <Form>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Place Name</Form.Label>
    <Form.Control type="text" placeholder="Enter warehouse name" onChange={onChangeHandler("name")} />

  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Address</Form.Label>
    <Form.Control type="text" placeholder="Enter the address" onChange={onChangeHandler("address")} />
  </Form.Group>
  <p>
    Please check the Map and update the correct Latitude and Longitude below.
  </p>
  <Form>
  <Form.Row className="mb-5">
    <Col>
      <Form.Control placeholder="Latitude" onChange={onChangeHandler("latitude")}/>
    </Col>
    <Col>
      <Form.Control placeholder="Longitude" onChange={onChangeHandler("longitude")}/>
    </Col>
  </Form.Row>
</Form>
<Form.Group controlId="formBasicPassword">
    <Form.Label>Warehouse area in (sq. ft)</Form.Label>
    <Form.Control type="text" placeholder="Enter the address"  onChange={onChangeHandler("area")}/>
  </Form.Group>
  <Form.Group controlId="formBasicPassword">
    <Form.Label>Population near the warehouse</Form.Label>
    <Form.Control type="text" placeholder="Enter the address" onChange={onChangeHandler("population")}/>
  </Form.Group>


    <Form.Group as={Row}>
      <Form.Label as="legend" column sm={2}>
        Warehouse Features
      </Form.Label>

        <Row className="mb-5 ml-5">
        <RadioGroup onChange={ handleFeatures } horizontal>
  <RadioButton value="apple">
    Apple
  </RadioButton>
  <RadioButton value="orange">
    Orange
  </RadioButton>
  <RadioButton value="melon">
    Melon
  </RadioButton>
  <ReversedRadioButton value="melon">
    Melon
  </ReversedRadioButton>
</RadioGroup>
        </Row>
   
    </Form.Group>

    <Form.Group as={Row}>
      <Form.Label as="legend" column sm={2}>
        Warehouse Amenities
      </Form.Label>

        <Row className="mb-5 ml-5">
        <RadioGroup onChange={ handleFeatures } horizontal>
  <RadioButton value="apple">
    Apple
  </RadioButton>
  <RadioButton value="orange">
    Orange
  </RadioButton>
  <RadioButton value="melon">
    Melon
  </RadioButton>
  <ReversedRadioButton value="melon">
    Melon
  </ReversedRadioButton>
</RadioGroup>
        </Row>
   
    </Form.Group>


      
    <div className="mt-5 mb-4">
    <p> Upload 3D plot image here</p>
          
            <p className="mb-4 mt-5">
              Here you should upload the 3D plot image
            </p>
        
            {plot3DStatus ? (
  <Pane>
<Alert
    intent="success"
    title="Your 3D plot is uploaded success"
    marginBottom={32}
  />
  </Pane>
    
) :(
<Pane>
<Alert
    intent="none"
    title="Your 3D plot is not submitted yet"
    marginBottom={32}
  />
</Pane>
)}

        {!progress3d  ? (
<div>
<div className="text-center mr-5 mb-5">
          
          <Image src={downloadURL || "https://i.ibb.co/8g5Wnm0/warehouse-model.png"} fluid />
            </div>
          <label>
            Choose file
          <input type="file" id="file" onChange={handle3DChange} />        
          </label>

          <button className="button" onClick={handle3DUpload}>Upload</button>

  </div>

        ) : (
          <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
  <Spinner />
</Pane>
        )}
       
            </div>

            <Form.Group controlId="formBasicEmail">
    <Form.Label>Excected Rent on Avg per month</Form.Label>
    <Form.Control type="text" placeholder="Enter warehouse name"  onChange={onChangeHandler("rent")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Number of partition</Form.Label>  
    <Form.Control type="text" placeholder="Enter number of partitions" onChange={onChangeHandler("nopartition")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Maximum number of partition</Form.Label>
    <Form.Control type="text" placeholder="Enter max partition" onChange={onChangeHandler("maxpartition")}/>

  </Form.Group>
<div className="mt-5">
<h3>
    Verification
  </h3>
<div>
<Form.Group controlId="formBasicEmail">
    <Form.Label>Owner Name</Form.Label>
    <Form.Control type="text" placeholder="Enter His/Her name" onChange={onChangeHandler("ownername")}/>

  </Form.Group>

  <Form.Group controlId="formBasicEmail">
    <Form.Label>Owner Aadhaar</Form.Label>
    <Form.Control type="text" placeholder="Enter owner's aadhar" onChange={onChangeHandler("aadhaar")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Owner Address</Form.Label>
    <Form.Control type="text" placeholder="Enter warehouse address" onChange={onChangeHandler("owneraddress")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Owner Watsapp Number</Form.Label>
    <Form.Control type="text" placeholder="Enter watsapp number" onChange={onChangeHandler("watsappNo")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Owner Phone2</Form.Label>
    <Form.Control type="text" placeholder="Enter owner phone2" onChange={onChangeHandler("phone2")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Owner email</Form.Label>
    <Form.Control type="text" placeholder="Enter notes if owner have any notes" onChange={onChangeHandler("ownerEmail")}/>

  </Form.Group>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Owner notes if any</Form.Label>
    <Form.Control type="textarea" placeholder="Enter warehouse name" onChange={onChangeHandler("notes")}/>

  </Form.Group>
</div>
</div>
 
<Button className="mb-5 mt-5" variant="outline-success" block onClick={onSubmitDummyPic}>Submit the Place</Button>
</Form>
            </div>
            <div className="mt-5">
      <p>
        You can manage all the Places and it's data in Manage Place tab
      </p>
            </div>
        </div>
    )
}

