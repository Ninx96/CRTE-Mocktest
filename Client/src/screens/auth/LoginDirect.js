import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import queryString from "query-string";
import { postRequest } from "../../services/Request";
import { useStateValue } from "../../services/StateProvider";
import moment from "moment";

function LoginDirect() {
  const [state, dispatch] = useStateValue();
  const history = useHistory();
  const { search } = useLocation();
  const { token } = queryString.parse(search);

  useEffect(() => {
    localStorage.clear();
    if (token) {
      const user = JSON.parse(window.atob(token.toString()));
      const newUser = {
        first_name: user.USER_FIRST_NAME,
        last_name: user.USER_LAST_NAME,
        email: user.USER_EMAIL,
        mobile: user.USER_MOBILE,
        asset_class: user.ASSET_CLASS_NAME,
        password: "aW5kaWEkMTIz",
        type: "AA",
      };

      const expire = Date.parse(user.EXPIRE);

      if (expire > Date.now()) {
        postRequest("auth/loginDirect", newUser).then((res) => {
          console.log(res);
          if (res.valid) {
            const encoded = res.token;
            const user = JSON.parse(window.atob(encoded.split(".")[1]));
            localStorage.setItem("session", encoded);
            dispatch({
              type: "LOGIN_USER",
              user: user,
            });
          } else {
            // setError({ message: res.message });
          }
        });
        return;
      }
    }

    history.push("/error404");
  }, []);

  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex flex-column justify-content-center"
    >
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: require("../../assets/9844-loading-40-paperplane.json"),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={400}
        width={500}
      />
      <h3 style={{ textAlign: "center" }}>Loading, Please Wait . . .</h3>
    </div>
  );
}

export default LoginDirect;
