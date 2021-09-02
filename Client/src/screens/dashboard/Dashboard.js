import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { getUser, postRequest } from "../../services/Request";
import { useStateValue } from "../../services/StateProvider";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

const Dashboard = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  const [exams, setExams] = useState([]);

  useEffect(() => {
    postRequest("test/history", {}).then((data) => {
      if (data.valid) {
        setExams(data.data);
      }
    });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          padding: 10,
          backgroundColor: "#A7C7E7",
        }}
        className="d-flex flex-row justify-content-center"
      >
        <h2 className="ms-auto">Dashboard</h2>
        <div className="d-flex flex-row  ms-auto justify-content-center">
          <FontAwesomeIcon icon={faUserCircle} size="3x" />
          <div className="d-flex flex-column mx-3">
            <h6>{user.user_name}</h6>
            <h6>{user.asset_class}</h6>
          </div>
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size="2x"
            onClick={() => {
              localStorage.removeItem("session");
              dispatch({
                type: "LOGOUT_USER",
              });
            }}
          />
        </div>
      </div>
      <div className="d-flex flex-row my-3 mx-5 p-3 border border-dark">
        <h4 className="align-self-center ms-auto">
          <FontAwesomeIcon icon={faHistory} size="lg" /> History
        </h4>
        <Link className="btn btn-success p-3 ms-auto" to="/test">
          Start Mocktest
        </Link>
      </div>
      <div className="d-flex flex-row my-3 mx-5 p-3 border border-dark  flex-wrap">
        {exams.map((item, index) => (
          <div className="col-md-4 p-3" key={index}>
            <div className="card">
              <div className="card-header">#{index + 1}</div>
              <div className="card-body">
                <h5 className="card-title">Asset Class : {item.asset_class}</h5>
                <p className="card-text">
                  Duration(Minutes) : 120 <br /> Questions : 90 <br /> Max.
                  Marks : 100
                </p>

                <input
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    dispatch({
                      type: "LOAD_EXAM",
                      exam_id: item._id,
                    });
                    history.push("/result");
                  }}
                  value="Check Answer Key"
                />
              </div>
              <div className="card-footer text-muted">
                {moment(item.datetime).format("LLL")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
