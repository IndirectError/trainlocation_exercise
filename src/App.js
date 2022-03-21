import './App.css';
import Login from './login';
import Trains from './trains';
import Register from './register';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Contains the main router structure of the app.
 * @returns {JSX.Element}
 * @constructor
 * Page to show train locations is protected and can be accessed by logging in.
 */
function App() {
  return (
      <div className="App">
        <Router>
          <Route exact path="/" component={Login}/>
            <Route exact path="/register" component={Register}/>
          <ProtectedRoute path="/trains" component={Trains}/>

        </Router>
      </div>

  );
}

export default App;
