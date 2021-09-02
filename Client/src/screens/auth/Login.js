import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "../../assets/crte-logo.png";
import queryString from "query-string";
import { postRequest } from "../../services/Request";
import { useStateValue } from "../../services/StateProvider";

function Login() {
  const { search } = useLocation();
  const { token } = queryString.parse(search);
  const [state, dispatch] = useStateValue();
  const history = useHistory();
  const [param, setParam] = useState({});
  const [error, setError] = useState({});

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-start p-5"
      style={{ height: "100vh", backgroundColor: "#2AAA8A" }}
    >
      <div
        className="container-fluid d-flex flex-row p-3 rounded"
        style={{ height: "85vh", backgroundColor: "#E6E6FA" }}
      >
        <div
          className="border p-5 d-flex flex-column col-sm-4 h-100 rounded"
          style={{ backgroundColor: "#FFF", overflowY: "scroll" }}
        >
          <img src={logo} style={{ height: 250, width: "100%" }} />

          <div className="my-4">
            <h3>Login</h3>
            <span style={{ color: "#888" }}>
              Doesn't have an account yet ? <Link to="/register">Sign Up</Link>
            </span>
          </div>

          <form className="requires-validation" noValidate>
            <div className="form-floating mb-3 mt-auto">
              <input
                type="email"
                className={
                  error.email ? "form-control is-invalid" : "form-control"
                }
                id="floatingInput"
                placeholder="name@example.com"
                onChange={(e) => {
                  setParam({
                    ...param,
                    email: e.target.value,
                  });
                }}
              />
              {error.email ? (
                <label className="invalid-feedback">Email is Required</label>
              ) : (
                <label htmlFor="floatingInput">Email address</label>
              )}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={
                  error.password ? "form-control is-invalid" : "form-control"
                }
                id="floatingPassword"
                placeholder="Password"
                onChange={(e) => {
                  setParam({
                    ...param,
                    password: e.target.value,
                  });
                }}
              />
              {error.password ? (
                <label className="invalid-feedback">Password is Required</label>
              ) : (
                <label htmlFor="floatingInput">Password</label>
              )}
            </div>

            <div className="d-flex flex-column  mt-auto">
              {error.message && (
                <span
                  style={{
                    color: "#dc3545",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {error.message}
                </span>
              )}
              <input
                type="submit"
                value="Login"
                className="btn btn-success p-3"
                onClick={(e) => {
                  e.preventDefault();
                  if (!param.email) {
                    setError({ email: true });
                    return;
                  }
                  if (!param.password) {
                    setError({ password: true });
                    return;
                  }
                  postRequest("auth/login", param).then((res) => {
                    if (res.valid) {
                      const encoded = res.token;
                      const user = JSON.parse(
                        window.atob(encoded.split(".")[1])
                      );
                      localStorage.setItem("session", encoded);
                      dispatch({
                        type: "LOGIN_USER",
                        user: user,
                      });
                    } else {
                      setError({ message: res.message });
                    }
                  });
                }}
              />
            </div>
          </form>
        </div>

        <div
          className="flex-fill"
          style={{
            backgroundImage: 'url("https://echat.elink.in/img/mocktest.jpg")',
          }}
        ></div>
      </div>
    </div>
  );
}

export default Login;
