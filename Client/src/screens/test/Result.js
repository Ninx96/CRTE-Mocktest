import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import { postRequest } from "../../services/Request";
import { useStateValue } from "../../services/StateProvider";

const Result = () => {
  const [{ exam_id }, dispatch] = useStateValue();
  const history = useHistory();
  const [result, setResult] = useState({ questions: [] });
  const [active, setActive] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    postRequest("test/result", { exam_id: exam_id }).then((data) => {
      if (data.valid) {
        setResult(data);
        setSelectedOption(data.questions[0].selected_option);
      } else {
        history.push("/error");
      }
    });
  }, []);

  return (
    <div>
      <div>
        <div
          style={{
            padding: 10,
            backgroundColor: "#A7C7E7",
          }}
          className="d-flex flex-row justify-content-center"
        >
          <h2 className="ms-auto">Exam Result</h2>
          <div className="d-flex flex-row  ms-auto justify-content-center">
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" /> Dashboard
            </Link>
          </div>
        </div>

        <div
          style={{
            marginInline: 40,
            borderWidth: 1,
            borderColor: "black",
            borderStyle: "solid",
            padding: 20,
            marginBlock: 20,
          }}
        >
          <h3 style={{ color: result.marks < 60 ? "#dc3545" : "#198754" }}>
            Your Score : {result.marks}
          </h3>
          {result.marks < 60 ? (
            <p>
              If this is your best shot beleive me i don't even wanna see your
              worst, go hit some books.
            </p>
          ) : (
            <p>
              Congratulations, you somehow managed to pass this one but don't
              let this go to your head remember this is not the actual exam
            </p>
          )}
        </div>

        <div
          style={{ display: "flex", flexDirection: "row", paddingBottom: 20 }}
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
                  Marks: +{result.questions[active]?.marks}.00, -0.25
                </span>
              </div>
              <span style={{ justifyContent: "start", textAlign: "start" }}>
                {result.questions[active]?.question}
              </span>
            </div>

            {/* options */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 15,
                  backgroundColor:
                    selectedOption === "A"
                      ? result.questions[active]?.correct_option === "A"
                        ? "#198754"
                        : "#dc3545"
                      : "#EEE",
                  marginBlock: 5,
                }}
              >
                <span>A). {result.questions[active]?.option_a}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 15,
                  backgroundColor:
                    selectedOption === "B"
                      ? result.questions[active]?.correct_option === "B"
                        ? "#198754"
                        : "#dc3545"
                      : "#EEE",
                  marginBlock: 5,
                }}
              >
                <span>B). {result.questions[active]?.option_b}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 15,
                  backgroundColor:
                    selectedOption === "C"
                      ? result.questions[active]?.correct_option === "C"
                        ? "#198754"
                        : "#dc3545"
                      : "#EEE",
                  marginBlock: 5,
                }}
              >
                <span>C). {result.questions[active]?.option_c}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 15,
                  backgroundColor:
                    selectedOption === "D"
                      ? result.questions[active]?.correct_option === "D"
                        ? "#198754"
                        : "#dc3545"
                      : "#EEE",
                  marginBlock: 5,
                }}
              >
                <span>D). {result.questions[active]?.option_d}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 15,
                  // backgroundColor: "#198754",
                  marginTop: 30,
                  marginBottom: 10,
                }}
              >
                <span>
                  Ans. Correct Option is{" "}
                  {result.questions[active]?.correct_option}
                </span>
              </div>
            </div>
            {/* Controls */}
            <div
              style={{
                marginTop: 100,
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
                  setSelectedOption(result.questions[act].selected_option);
                }}
                value="Previous"
              />
              <input
                type="button"
                className="btn btn-primary mx-1"
                disabled={active === result.questions.length - 1}
                onClick={() => {
                  const act = active + 1;
                  setActive(act);
                  setSelectedOption(result.questions[act].selected_option);
                }}
                value="Next"
              />

              <input
                type="button"
                className="btn btn-success mx-1 ms-auto"
                onClick={() => {
                  history.push("/test");
                }}
                value="Reset Test"
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
                // maxHeight: 250,
                width: 500,
              }}
            >
              {result.questions.map((item, index) => (
                <div
                  className="card btn m-1"
                  style={{
                    width: 45,
                    backgroundColor: !item.selected_option
                      ? null
                      : item.selected_option == item.correct_option
                      ? "#198754"
                      : "#dc3545",
                  }}
                  onClick={() => {
                    setActive(index);
                    setSelectedOption(item.selected_option);
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
                <h5 style={{ color: "#dc3545" }}>
                  Wrong Answers {result.incorrect}
                </h5>
                <h5 style={{ color: "#198754" }}>
                  Correct Answers {result.correct}
                </h5>

                <h5>Attempted Questions {result.correct + result.incorrect}</h5>
                <h5 style={{ color: "orange" }}>
                  Un-Attempted Questions{" "}
                  {90 - (result.correct + result.incorrect)}
                </h5>
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
                <span>Correct Answer</span>
              </div>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  className="card btn m-1"
                  style={{ backgroundColor: "#dc3545" }}
                ></div>
                <span>Wrong Answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
