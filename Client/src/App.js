import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Login from "./screens/auth/Login";
import LoginDirect from "./screens/auth/LoginDirect";
import Register from "./screens/auth/Register";
import Dashboard from "./screens/dashboard/Dashboard";
import Error404 from "./screens/errors/Error404";
import Result from "./screens/test/Result";
import Test from "./screens/test/Test";
import { useStateValue } from "./services/StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    let user;
    const session = localStorage.getItem("session");
    if (session) {
      user = JSON.parse(window.atob(session.split(".")[1]));
    }
    dispatch({
      type: "LOGIN_USER",
      user: user,
    });
  }, []);

  if (user) {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/test" component={Test} />
            <Route path="/result" component={Result} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/error" component={Error404} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Router>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/exam-login" component={LoginDirect} />
          <Route path="/login" component={Login} />
          <Route path="/error404" component={Error404} />
          <Redirect from="/" to="/error404" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
