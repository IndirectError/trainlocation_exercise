/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import axios from "axios";
import {render} from "@testing-library/react";
import {Helmet} from "react-helmet";



/**
 * Main properties of the page
 * @returns {JSX.Element} to build the page as needed
 * @constructor
 */
const Trains = () => {
    const [data, setData] = useState([{},{}]);

    /**
     * Function to log the user out,
     * by clearing the access token from localStorage and redirecting to the frontpage
     */
    function logout() {
        localStorage.clear();
        window.location.href = '/';
        alert('You are being logged out!');
    }


    /**
     * UseEffect hook to get the train locations from the backend api.
     * the hook has a interval of 5 seconds to contact the backend api for new locations,
     * that are then stored in the data useState hook
     */
    useEffect( () => {
        let timerFunc = setInterval(() => {
            const getTrains = () => {
                axios.get('http://127.0.0.1:8123/api/trainlocations',{params:{token: localStorage.getItem('myToken')}}).then(response => {
                const res = (response.request.responseText);
                setData(JSON.parse(res));
            })
        };
            getTrains();
        }, 5000);
        return () => clearTimeout(timerFunc);
        });
    /**
     * The render renders the webpage content
     */
    render()
    {

        /**
         * the return to build the page content, where the train data hook is treated as a data map,
         * which data is then placed into a table element
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
                            <a href="/">Frontpage</a>
                            <a onClick={logout}>Log out</a>
                        </div>
                    </div>
                </div>
                {data.map(function(data, number) {
                return (
                    <div id={"table"}>
                    <table dataPresent={data.trainNumber}>
                    <thead>
                    <tr>
                        <th>{'Train number and name: '+data.trainNumber+"/"+data.name}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{'Destination: '+data.destination}</td>
                        <td>{'Speed: '+data.speed}</td>
                        <td>{'Location: '+data.coordinates}</td>
                    </tr>
                    </tbody>
                    </table>
                        </div>
                )
            })}</div>
        )
    }
};

export default Trains;