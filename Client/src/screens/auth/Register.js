import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useHistory, Link } from "react-router-dom";
import { postRequest } from "../../services/Request";

function Register() {
  const history = useHistory();
  const [param, setParam] = useState({ type: "crte" });
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
          className="border p-5 col-sm-4 h-100  d-flex  flex-column rounded"
          style={{ backgroundColor: "#FFF", overflowY: "scroll" }}
        >
          <div className="mb-5">
            <h3>Register</h3>
            <span style={{ color: "#888" }}>
              Already have an account ? <Link to="/login">Sign In</Link>
            </span>
          </div>

          <div class="form-floating mb-3">
            <input
              type="text"
              class={error.name ? "form-control is-invalid" : "form-control"}
              id="floatingInput"
              placeholder="name"
              onChange={(e) => {
                setParam({
                  ...param,
                  first_name: e.target.value,
                });
              }}
            />
            {error.first_name ? (
              <label className="invalid-feedback">First Name is Required</label>
            ) : (
              <label for="floatingInput">First Name</label>
            )}
          </div>

          <div class="form-floating mb-3">
            <input
              type="text"
              class={error.name ? "form-control is-invalid" : "form-control"}
              id="floatingInput"
              placeholder="name"
              onChange={(e) => {
                setParam({
                  ...param,
                  last_name: e.target.value,
                });
              }}
            />
            {error.last_name ? (
              <label className="invalid-feedback">Last Name is Required</label>
            ) : (
              <label for="floatingInput">Last Name</label>
            )}
          </div>

          <div class="form-floating mb-3">
            <input
              type="number"
              class={error.mobile ? "form-control is-invalid" : "form-control"}
              id="floatingInput"
              placeholder="9876543210"
              onChange={(e) => {
                setParam({
                  ...param,
                  mobile: e.target.value,
                });
              }}
            />
            {error.mobile ? (
              <label className="invalid-feedback">Mobile is Required</label>
            ) : (
              <label for="floatingInput">Mobile</label>
            )}
          </div>

          <div class="form-floating mb-3">
            <input
              type="email"
              class={error.email ? "form-control is-invalid" : "form-control"}
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
              <label for="floatingInput">Email address</label>
            )}
          </div>

          <div class="form-floating mb-3">
            <select
              class={
                error.asset_class ? "form-select is-invalid" : "form-select"
              }
              id="floatingSelect"
              aria-label="Asset Class"
              onChange={(e) => {
                setParam({
                  ...param,
                  asset_class: e.target.value,
                });
              }}
            >
              <option selected="">Select an Option</option>
              <option value="L&B">Land & Building</option>
              <option value="P&M">Plant & Machinery</option>
              <option value="SorFA">Security or Financial Assets</option>
            </select>
            {error.asset_class ? (
              <label className="floatingSelect invalid-feedback">
                Email is Required
              </label>
            ) : (
              <label for="floatingSelect">Class of Assets</label>
            )}
          </div>

          <div class="form-floating">
            <input
              type="text"
              class={
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
              <label for="floatingInput">Password</label>
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
            {error.succeess && (
              <span
                style={{
                  color: "#198754",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {error.succeess}
              </span>
            )}
            <input
              type="submit"
              value="Register"
              className="btn btn-success p-3"
              onClick={(e) => {
                e.preventDefault();
                if (!param.first_name) {
                  setError({ first_name: true });
                  return;
                }
                if (!param.last_name) {
                  setError({ last_name: true });
                  return;
                }
                if (!param.mobile) {
                  setError({ password: true });
                  return;
                }
                if (!param.email) {
                  setError({ email: true });
                  return;
                }
                if (!param.asset_class) {
                  setError({ asset_class: true });
                  return;
                }

                if (!param.password) {
                  setError({ password: true });
                  return;
                }

                postRequest("auth/register", param).then((res) => {
                  if (res.valid) {
                    setError({ succeess: res.message });
                    setTimeout(() => {
                      history.push("/login");
                    }, 1000);
                  } else {
                    setError({ message: res.message });
                  }
                });
              }}
            />
          </div>
        </div>

        <div
          className="flex-fill"
          style={{
            backgroundImage:
              'url("https://static-frm.ie.edu/university/wp-content/uploads/sites/6/2017/02/MicrosoftTeams-image-21-1-780x406.png")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Register;
