import React, {useState } from 'react';
import {Helmet} from 'react-helmet';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import {Link} from "react-router-dom";


/**
 * Variable for the result of the authentication process from the backend server.
 * **/
let json;

/**
 * Variable for the authentication token, with initial value
 */
let tokenKey = 'myToken';

/*
class Redirect extends React.Component {
  render() {
    return null;
  }
}
Redirect.propTypes = {to: PropTypes.string};

 */

/**
 * Main properties of the page
 * @returns {JSX.Element} to build the page as needed
 * @constructor
 */
const Login = () => {

  /**
   * useState hooks to contain user information and information of the form validation process
   */
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userData, setUserData] = useState({});
  const [validated, setValidated] = useState(false);
  const [logged, setLogged] = useState(() => {
    return localStorage.getItem(
        'myToken') !== null;
  });


  /**
   * Handles the change of the username field to the useState hook
   */
  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  /**
   * Handles the change of the password field to the useState hook
   */
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  /**
   * Validates the form and proceeds accordingly, if correctly filled, useState hook of validation is changed and the form is submitted
   */
  const validityChecker = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log('invalid');
      event.preventDefault();
      event.stopPropagation();
    } else {
      handleSubmit(event);
    }
    setValidated(true);

  };

  /**
   * Submits the form, by creating a JSON object with credentials and connects to the backend API, for authentication process.
   * With the received result code, either user account info is stored to local storage or the page prompts an alert of failed login.
   */
  const handleSubmit = event => {
    const userObject = {
      username: newUsername,
      password: newPassword,
    };

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        console.log(xmlhttp.status);

        switch (xmlhttp.status) {
          case 201: //No account
              window.location.href = '/register';
            break;
          case 202: // Logged in
            json = JSON.parse(xmlhttp.responseText);
            console.log("JSON: "+json);
            if (json.accessToken !== null) { // something found
              localStorage.setItem(tokenKey, json.accessToken);
              localStorage.setItem('username', json.username);
              localStorage.setItem('email', json.email);
              localStorage.setItem('name', json.name);
              console.log('User found! ' + json.accessToken);
              alert('You are succesfully logged in!');
              window.location.href = '/trains';
            }
            break;
          case 400:
            alert('Error!');
            break;
          case 401: // Wrong password
            alert('Wrong password!');
            break;
          default:
        }
      }
    };
    /**
     * xmlhttp request to backen endpoint for authentication process
     */
    xmlhttp.open('POST', 'http://localhost:8123/api/login', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(userObject));
    setValidated(true);
    event.preventDefault();
  };

  /**
   * Returns the element structure of the page.
   */
  return (
      <div>
        <Helmet>
          <link rel="stylesheet" href="/css/landingpage.css"/>
        </Helmet>
        <div id="header">
          <div className="dropdown">
            <div id="drop_button"><img alt=""
                                            src="./img/iconfinder_multimedia-24_2849812.png"/>
            </div>
            <div id="dropdown_content">
              <a href="/trains">Train locations</a>
            </div>
          </div>
        </div>

        <div id="main">
          <div id="log">
            <div style={{display: logged ? 'block' : 'none'}}>
              <p>Your username: {localStorage.username}<br/>Email: {localStorage.email}<br/>Name: {localStorage.name}</p>
              <Button onClick={() => {
                localStorage.clear();
                setUserData({});
                setLogged(false);
                alert('You have been logged out!');
              }}>Log out</Button>
            </div>

            <Form style={{display: logged ? 'none' : 'block'}} id="loginForm"
                  noValidate validated={validated} onSubmit={validityChecker}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="username" value={newUsername}
                              placeholder="Type your username"
                              onChange={handleUsernameChange} required/>
                <Form.Control.Feedback type="invalid">Give approved username</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={newPassword}
                              placeholder="password"
                              onChange={handlePasswordChange} required/>
                <Form.Control.Feedback type="invalid">Wrong Password</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
            <Link style={{display: logged ? 'none' : 'block'}} to="/register" className="btn btn-secondary">Sign up</Link>
          </div>
        </div>
      </div>
  );
};
export default Login;