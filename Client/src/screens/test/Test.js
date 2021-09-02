import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";

import { postRequest } from "../../services/Request";
import { useStateValue } from "../../services/StateProvider";

function Test() {
  const [{ exam_id }, dispatch] = useStateValue();

  const [showAlert, setShowAlert] = useState({
    alert: false,
    option: false,
    error: false,
  });
  const confirm = useConfirm();
  const history = useHistory();
  const [questions, setQuestions] = useState([]);
  const [active, setActive] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [Timer, setTimer] = useState("00:00:00");

  let submitTime = moment().add(120, "minutes");

  const timeCounter = () => {
    const counter = (submitTime - moment()) / 1000;
    if (counter <= 0) {
      history.push("/result");
    } else {
      let hours = Math.floor(counter / 3600);
      let minutes = Math.floor((counter % 3600) / 60);
      let seconds = Math.floor(counter % 60);

      let displayHours = hours < 10 ? "0" + hours : hours;
      let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
      let displaySeconds = seconds < 10 ? "0" + seconds : seconds;

      setTimer(displayHours + ":" + displayMinutes + ":" + displaySeconds);
    }
  };

  const countSummary = () => {
    var selectedCounter = 0;
    var reviewCounter = 0;
    questions.forEach((item) => {
      if (item.selected) {
        selectedCounter++;
      }
      if (item.review) {
        reviewCounter++;
      }
    });
    return { attempted: selectedCounter, markReview: reviewCounter };
  };
  useEffect(() => {
    postRequest("test/create", {}).then((data) => {
      if (data.valid) {
        dispatch({
          type: "LOAD_EXAM",
          exam_id: data._id,
        });
        setQuestions(data.quesList);
      } else {
        history.push("/error");
      }
    });
    let handler = setInterval(timeCounter, 1000);

    return () => {
      clearInterval(handler);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: 10,
          backgroundColor: "#A7C7E7",
        }}
      >
        <h2>⏰ Time : </h2>{" "}
        <h2 style={{ color: "#dc3545", marginLeft: 5 }}> {Timer}</h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBlock: 20,
        }}
      >
        {/* question */}

        <div
          style={{
            flex: 3,
            borderWidth: 1,
            borderColor: "black",
            borderStyle: "solid",
            padding: 10,
            marginLeft: 40,
            marginRight: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              paddingBlock: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  padding: 10,
                  alignItems: "center",
                  backgroundColor: "#EEE",
                  borderRadius: 5,
                }}
              >
                <h6>Q{active + 1}.</h6>
              </div>

              <span style={{ marginLeft: "auto", fontWeight: "bolder" }}>
                Marks: +{questions[active]?.marks}.00, -0.25
              </span>
            </div>
            <span style={{ justifyContent: "start", textAlign: "start" }}>
              {questions[active]?.question}
            </span>
          </div>

          {/* options */}
          <div onChange={(e) => setSelectedOption(e.target.value)}>
            <div
              className="btn"
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 15,
                backgroundColor: selectedOption === "A" ? "#A7C7E7" : "#EEE",
                marginBlock: 5,
              }}
              onClick={() => setSelectedOption("A")}
            >
              <span style={{ textAlign: "start" }}>
                A). {questions[active]?.option_a}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 15,
                backgroundColor: selectedOption === "B" ? "#A7C7E7" : "#EEE",
                marginBlock: 5,
              }}
              className="btn"
              onClick={() => setSelectedOption("B")}
            >
              <span style={{ textAlign: "start" }}>
                B). {questions[active]?.option_b}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 15,
                backgroundColor: selectedOption === "C" ? "#A7C7E7" : "#EEE",
                marginBlock: 5,
              }}
              className="btn"
              onClick={() => setSelectedOption("C")}
            >
              <span style={{ textAlign: "start" }}>
                C). {questions[active]?.option_c}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 15,
                backgroundColor: selectedOption === "D" ? "#A7C7E7" : "#EEE",
                marginBlock: 5,
              }}
              className="btn"
              onClick={() => setSelectedOption("D")}
            >
              <span style={{ textAlign: "start" }}>
                D). {questions[active]?.option_d}
              </span>
            </div>
          </div>

          {/* Controls */}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "auto",
            }}
          >
            <input
              type="button"
              className="btn btn-primary mx-1"
              disabled={active === 0}
              onClick={() => {
                const act = active - 1;
                setActive(act);
                setSelectedOption(questions[act].selected);
              }}
              value="Previous"
            />
            <input
              type="button"
              className="btn btn-primary mx-1"
              onClick={() => {
                postRequest("test/markAnswer", {
                  exam_id: exam_id,
                  question_id: questions[active]._id,
                  answer: selectedOption,
                }).then((data) => {
                  if (!data.valid) {
                    confirm({
                      title: "Error",
                      description: "Error registering user response",
                    });
                  }
                });

                questions.splice(active, 1, {
                  ...questions[active],
                  review: true,
                  selected: selectedOption,
                });
                // setQuestions([...questions]);
                setActive(active + 1);
                setSelectedOption(null);
              }}
              value="Mark Review"
            />

            <input
              type="button"
              className="btn btn-success mx-1"
              onClick={() => {
                if (!selectedOption) {
                  confirm({
                    title: "Option not Selected",
                    description: "Plese select an option first",
                  });
                  return;
                }
                postRequest("test/markAnswer", {
                  exam_id: exam_id,
                  question_id: questions[active]._id,
                  answer: selectedOption,
                }).then((data) => {
                  if (!data.valid) {
                    confirm({
                      title: "Error",
                      description: "Error registering user response",
                    });
                  }
                });
                questions.splice(active, 1, {
                  ...questions[active],
                  selected: selectedOption,
                  review: false,
                });
                //setQuestions([...questions]);
                setSelectedOption(null);
                if (active >= questions.length - 1) {
                  // setActive(0);
                  return;
                }
                setActive(active + 1);
              }}
              value={active >= questions.length - 1 ? "Save" : "Save & Next"}
            />

            <input
              type="button"
              className="btn btn-outline-dark mx-1"
              onClick={() => {
                setSelectedOption(null);
                postRequest("test/markAnswer", {
                  exam_id: exam_id,
                  question_id: questions[active]._id,
                  answer: null,
                }).then((data) => {
                  if (!data.valid) {
                    confirm({
                      title: "Error",
                      description: "Error registering user response",
                    });
                  }
                });
              }}
              value="Clear"
            />
            <input
              type="button"
              className="btn btn-danger ms-auto"
              onClick={() => {
                confirm({
                  title: "Are you sure ?",
                  description: "Exam will be submitted..!",
                })
                  .then(() => {
                    history.push("/result");
                  })
                  .catch(() => {});
              }}
              value="End Test"
            />
          </div>
        </div>
        <div
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "black",
            borderStyle: "solid",
            padding: 10,
            marginLeft: 10,
            marginRight: 40,
            backgroundColor: "#CCCCFF",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: "#FFF",
              borderStyle: "solid",
            }}
          >
            <h4>Questions</h4>
            <h4>90</h4>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: 5,
              // overflowY: "scroll",
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: "#FFF",
              borderStyle: "solid",
              // maxHeight: 200,
              width: 500,
            }}
          >
            {questions.map((item, index) => (
              <div
                className="card btn m-1"
                style={{
                  width: 45,
                  backgroundColor: item.selected
                    ? item.review
                      ? "orange"
                      : "#198754"
                    : item.review
                    ? "yellow"
                    : null,
                }}
                onClick={() => {
                  setActive(index);
                  setSelectedOption(item.selected);
                }}
              >
                <span style={{ fontSize: 12 }}>{index + 1}</span>
              </div>
            ))}
          </div>

          <div>
            <div
              style={{ backgroundColor: "#FFF", padding: 5, marginBlock: 10 }}
            >
              <h5>Marked for Review {countSummary().markReview}</h5>
              <h5>Attempted Questions {countSummary().attempted}</h5>
              <h5>Un-Attempted Questions {90 - countSummary().attempted}</h5>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="card btn m-1"></div>
              <span>Not Answered</span>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                className="card btn m-1"
                style={{ backgroundColor: "#198754" }}
              ></div>
              <span>Answered</span>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                className="card btn m-1"
                style={{ backgroundColor: "yellow" }}
              ></div>
              <span>Not Answered Marked for Review</span>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                className="card btn m-1"
                style={{ backgroundColor: "orange" }}
              ></div>
              <span>Answered Marked for Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
