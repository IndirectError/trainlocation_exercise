import React, { useEffect, useRef, useState } from 'react';
import {Helmet} from 'react-helmet';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import * as PropTypes from 'prop-types';


/*
class Redirect extends React.Component {
    render() {
        return null;
    }
}
Redirect.propTypes = {to: PropTypes.string};
*/

/**
 * Main properties of the register page, to handle registration process
 * @returns {JSX.Element} to build the page as needed
 * @constructor
 */
const Register = () => {

    /**
     * useState hooks to contain user information and information of the form validation process
     */
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [validated, setValidated] = useState(false);



    /**
     * Handles the change of the username field to the useState hook
     */
    const handleUsernameChange = (event) => {
        console.log(event.target.value);
        setNewUsername(event.target.value);
    };


    /**
     * Handles the change of the password field to the useState hook
     */
    const handlePasswordChange = (event) => {
        console.log(event.target.value);
        setNewPassword(event.target.value);
    };


    /**
     * Handles the change of the email field to the useState hook
     */
    const handleEmailChange = (event) => {
        console.log(event.target.value);
        setNewEmail(event.target.value);
    };

    /**
     * Handles the change of the name field to the useState hook
     */
    const handleNameChange = (event) => {
        console.log(event.target.value);
        setNewName(event.target.value);
    };

    /**
     * Validates the registration form and proceeds accordingly, if correctly
     * filled, useState hook of validation is changed and the form is submitted
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
     * Submits the form, by creating a JSON object with credentials and connects to the backend API with xmlhttp request,
     * for authentication process.
     * With the received result code, either user account info is stored to local storage or the page
     * prompts an alert of failed login.
     */
    const handleSubmit = event => {
        const userObject = {
            username: newUsername,
            password: newPassword,
            email: newEmail,
            name: newName
        };

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                console.log(xmlhttp.status);

                switch (xmlhttp.status) {
                    case 200: // Succesfull register
                        alert('Succesfully registered \n You are now redirected to the login page!');
                            window.location.href = '/';
                        break;
                    case 400: //User creation failed
                        alert('Error!');
                        break;
                    default:

                }

            }
        };
        xmlhttp.open('POST', 'http://localhost:8123/api/register', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(userObject));
        setValidated(true);
        event.preventDefault();
    };

    return (
        <div className="bg-image">
            <Helmet>
                <link rel="stylesheet" href="/css/landingpage.css"/>
            </Helmet>
            <div id="header">
                <div className="dropdown">
                    <div id="drop_button"><img alt=""
                                                    src="./img/iconfinder_multimedia-24_2849812.png"/>
                    </div>
                    <div id="dropdown_content">
                        <a href="/">Frontpage</a>
                    </div>
                </div>
            </div>

            <div id="main">
                <div id="log">

                    <Form id="loginForm"
                          noValidate validated={validated} onSubmit={validityChecker}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control type="username" value={newUsername}
                                          placeholder="Type your username"
                                          onChange={handleUsernameChange} required/>
                            <Form.Control.Feedback type="invalid">Give approved username</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" value={newEmail}
                                          placeholder="Type your email"
                                          onChange={handleEmailChange} required/>
                            <Form.Control.Feedback type="invalid">Give approved email</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="name" value={newName}
                                          placeholder="Type your name"
                                          onChange={handleNameChange} required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" value={newPassword}
                                          placeholder="password"
                                          onChange={handlePasswordChange} required/>
                            <Form.Control.Feedback type="invalid">Wrong Password</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>

                </div>
            </div>
        </div>
    );
};
export default Register;