import React from 'react';
import {TextField} from '@material-ui/core';

import {
  useHistory
} from "react-router-dom";
import axios from 'axios';

import {Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CountryDropdown } from 'react-country-region-selector';
import { WithContext as ReactTags } from 'react-tag-input';
import './Styling/reactTags.css';


export default function Signup(props){
  const [username, setUsername ]= React.useState("");
  const [password, setPassword] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState(false);
  const [confirmPasswordText, setConfirmPasswordText] = React.useState(" ");
  const [confirmPasswordColor, setConfirmPasswordColor] = React.useState("");
  const [invokeUrl] = React.useState("http://127.0.0.1:5000/newsify")

  const [ tags, setTags ] = React.useState([]);

  const history = useHistory();

  const KeyCodes = {
    tab: 9,
    comma: 188,
    enter: 13,
  };
   
  const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

  const updateUsername = (e) => {
    setUsername(e.target.value);
  }

  const updatePassword = (e) => {
    setPassword(e.target.value);
  }

  const selectCountry = (val) => {
    setCountry(val);
  }

  const checkPassword = (e) => {
    if(e.target.value === password) {
      setConfirmPassword(true);
      setConfirmPasswordText("Password match!");
      setConfirmPasswordColor("green");
    }
    else {
      setConfirmPassword(false);
      setConfirmPasswordText("Password does not match!");
      setConfirmPasswordColor("red");
    }
    
  }

  const createCredentials = (e) => {
    if(/\s/g.test(username) || username === "") {
      window.alert("Enter a valid username.")
    } else if (/\s/g.test(password) || password.length <= 4 || password === "" ) {
      window.alert("Enter a valid password.")
    }
    else {
      const url = invokeUrl+"/users?username="+username+"&password="+password+"&country="+country+"&tags="+tags;
      // axios.post(url)
      axios.post(invokeUrl+"/users", {
        "username": username,
        "password": password,
        "country" :country,
        "tags": tags,
      })
      .then(res => {
        if(res.data["result"] === "Exists"){
          window.alert("User already exists!")
        }
        else {
          history.push('/');
        }
      })
    }
    
  }

  const goBackToLogin = () => {
    history.push("/", );
  }

  const handleDelete = (i) => {
      
      let tempTags = tags.filter((tag, index) => index !== i);

      setTags(tempTags);
  }

  const handleAddition = (newTag) => {
      setTags([...tags, newTag]);
      console.log(tags);
  }

  const handleDrag = (tag, currPos, newPos) => {
      const tempTags = tags;
      const newTags = tempTags.slice();

      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);

      // re-render
      setTags(newTags);
  }

  return(
  <div style={styling.mainDiv}>
    <h1 style = {styling.title}> Newsify</h1>
    <h2 >Signup</h2>
    <TextField id="outlined-basic" 
                style = {styling.textField}
                label="Username:" 
                variant="outlined" 
                onChange = {updateUsername}/>
    <br/>            
    <TextField id="outlined-basic"
                style = {styling.textField} 
                label="Password:" 
                variant="outlined" 
                type="password"
                onChange = {updatePassword}
                />
    <br/>
    <TextField id="outlined-basic"
                style = {styling.textField} 
                label="Confirm password:" 
                variant="outlined" 
                type="password"
                onChange = {checkPassword}
                />
                <br/>
                <div style = {{color: confirmPasswordColor, fontSize: '10px'}}>
                {confirmPasswordText}
                </div>
    <br/>
    {/* <TextField id="outlined-basic" 
                style = {styling.textField}
                label="Username:" 
                variant="outlined" 
                onChange = {updateUsername}/> */}
    <CountryDropdown
      value = {country}
      valueType = "short"
      onChange = {selectCountry}
      style = {{
        width: "240px",
      }}
    />
    <br/>
    <br/>

    <ReactTags
      classNames={{
        tags: 'ReactTags__tags',
        tagInput: 'ReactTags__tagInput',
        tagInputField: 'ReactTags__tagInputField',
        selected: 'ReactTags__selected',
        tag: 'ReactTags__selected ReactTags__tag',
        remove: 'ReactTags__selected ReactTags__remove',
        suggestions: 'ReactTags__suggestions',
        activeSuggestion: 'ReactTags__suggestions'
      }} 
      inline={false}
      tags={tags}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      handleDrag={handleDrag}
      delimiters={delimiters} />
    <br/>
    <br/>                    
    <Button style = {styling.button} 
            onClick = {createCredentials}
            variant = 'dark'>Create account</Button>
    <br/>
    <Button style = {styling.button} 
            onClick = {goBackToLogin}
            variant = 'dark'>Go back to login</Button>

  </div>);
}


//Styling for the page
const styling = {
  mainDiv: {
    position: 'absolute', left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)',
    // border: '1px solid black',
    borderRadius: '10px',
    // height: '48vh',
    width: '60vh',
    display: 'inline-block',
    textAlign: 'center',
  },
  textField: {
    marginBottom: '2vh',
    marginTop: '2vh'
  },
  confirmPassword: {
    fontSize: '8px',
  },
  button: {
    marginTop: '1vh',
    marginBottom: '1vh'
  },
  title: {
    marginTop: '1vh',
    fontWeight: 'bold',
    fontFamily: "Poynter",
    fontSize: "60px",
  }
};