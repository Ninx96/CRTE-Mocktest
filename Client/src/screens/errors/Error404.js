import React from "react";
import bg from "../../assets/bg4.jpeg";
const Error404 = () => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div class="d-flex flex-column">
        <div class="d-flex flex-row">
          <div class="d-flex flex-column flex-row align-items-center align-items-start justify-content-center text-center text-md-start px-5 px-5 py-5 py-0">
            <h1
              style={{ fontSize: 200, fontWeight: "bolder" }}
              class="text-danger mb-0"
            >
              404
            </h1>
            <p
              style={{
                fontSize: 120,
                fontWeight: "bolder",
                lineHeight: "60px",
              }}
              class="text-danger mb-5"
            >
              ERROR
            </p>
            <p class="display-6 text-danger mt-0 fw-bolder">
              Nothing left to do here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
