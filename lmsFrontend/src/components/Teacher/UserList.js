import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import MessagesList from "./MessagesList";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function UserList() {
  const [StudentData, setStudentData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [loading, setLoading] = useState(true); // Track the loading state

  const teacherId = localStorage.getItem("teacherId");
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios
        .get(baseURL + "/fetch-all-enrolled-students/" + teacherId)
        .then((res) => {
          settotalResult(res.data.length);
          setStudentData(res.data);
          console.log("studentData------->", res.data);
          console.log("no of records------>", res.data.length);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  const [groupMsgData, setgroupMsgData] = useState({
    msgText: "",
  });

  const [groupSuccessMsg, setgroupSuccessMsg] = useState("");
  const [groupErrorMsg, setgroupErrorMsg] = useState("");

  const [msgData, setmsgData] = useState({
    msgText: "",
  });

  const [successMsg, setsuccessMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");

  const handleChange = (event) => {
    setmsgData({
      ...msgData,
      [event.target.name]: event.target.value,
    });
  };

  const changeMsg = (event) => {
    seterrorMsg("");
    setsuccessMsg("");
  };

  // Send Message
  const submitForm = (student_id) => {
    const _formData = new FormData();
    _formData.append("msgText", msgData.msgText);
    _formData.append("msgFrom", "teacher");
    try {
      axios
        .post(
          baseURL + "/send-message/" + teacherId + "/" + student_id,
          _formData
        )
        .then((res) => {
          if (res.data.bool === true) {
            setmsgData({
              msgText: "",
            });
            seterrorMsg("");
            setsuccessMsg(res.data.msg);
          } else {
            setsuccessMsg("");
            seterrorMsg(res.data.msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const groupHandleChange = (event) => {
    setgroupMsgData({
      ...groupMsgData,
      [event.target.name]: event.target.value,
    });
  };

  // Send Message to group
  const groupSubmitForm = () => {
    const _formData = new FormData();
    _formData.append("msgText", groupMsgData.msgText);
    _formData.append("msgFrom", "teacher");

    try {
      axios
        .post(baseURL + "/send-group-message/" + teacherId, _formData)
        .then((res) => {
          if (res.data.bool === true) {
            setgroupMsgData({
              msgText: "",
            });
            setgroupErrorMsg("");
            setgroupSuccessMsg(res.data.msg);
          } else {
            setgroupSuccessMsg("");
            setgroupErrorMsg(res.data.msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const msgList = {
    height: "500px",
    overFlow: "auto",
  };

  if (loading) {
    return (
      <div className="container mt-4 mb-4">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              <span className="text-dark">
                All Students List{" "}
                <span className="badge text-bg-primary">{totalResult}</span>
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm float-end"
                data-bs-toggle="modal"
                data-bs-target="#groupMsgModal"
              >
                Send Message
              </button>
            </h5>
            {/* Group message modal form */}
            <div
              class="modal fade"
              id="groupMsgModal"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="groupMsgModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="groupMsgModalLabel">
                      Send Message to All Students
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <small>
                      {groupSuccessMsg && (
                        <p className="text-success">{groupSuccessMsg}</p>
                      )}
                      {groupErrorMsg && (
                        <p className="text-danger">{groupErrorMsg}</p>
                      )}
                    </small>
                    <form>
                      <div className="mb-3">
                        <label for="msgText" className="form-label">
                          Message
                        </label>
                        <textarea
                          className="form-control"
                          id="msgText"
                          name="msgText"
                          rows="10"
                          onChange={groupHandleChange}
                          value={groupMsgData.msgText}
                          // onClick={changeMsg}
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={groupSubmitForm}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* Group message modal form end */}
            <div className="card-body">
              {StudentData.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course Enrolled</th>
                      <th>Interests</th>
                      <th>Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {StudentData.map((row, index) => (
                      <tr>
                        <td>{row.student.fullName}</td>
                        <td>{row.student.user.email}</td>
                        <td>{row.course.title}</td>
                        <td>{row.student.interestedCategories}</td>
                        <td>
                          <Link
                            to={`/show-assignment/${row.student.id}/${teacherId}`}
                            className="btn btn-sm btn-warning me-2 mb-2"
                          >
                            Assignments
                          </Link>
                          <Link
                            to={`/add-assignment/${row.student.id}/${teacherId}`}
                            className="btn btn-sm btn-success me-2 mb-2"
                          >
                            Add Assignment
                          </Link>
                          <button
                            className="btn btn-sm btn-primary mb-2"
                            title="Send Message"
                            data-bs-toggle="modal"
                            data-bs-target={`#msgModal${index}`}
                          >
                            <i className="bi bi-chat-fill"></i>
                          </button>
                          <div
                            className="modal fade"
                            id={`msgModal${index}`}
                            tabindex="-1"
                            aria-labelledby="msgModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-xxl-down">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="msgModalLabel"
                                  >
                                    <span className="text-danger">
                                      {row.student.fullName}
                                    </span>
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div className="row">
                                    <div
                                      className="col-md-8 mb-2 col-12 border-end"
                                      style={msgList}
                                    >
                                      <MessagesList
                                        teacher_id={teacherId}
                                        student_id={row.student.id}
                                      />
                                    </div>
                                    <div className="col-md-4 col-12 float-end">
                                      <small>
                                        {successMsg && (
                                          <p className="text-success">
                                            {successMsg}
                                          </p>
                                        )}
                                        {errorMsg && (
                                          <p className="text-danger">
                                            {errorMsg}
                                          </p>
                                        )}
                                      </small>
                                      <form>
                                        <div className="mb-3">
                                          <label
                                            for="msgText"
                                            className="form-label"
                                          >
                                            Message
                                          </label>
                                          <textarea
                                            className="form-control"
                                            id="msgText"
                                            name="msgText"
                                            rows="10"
                                            onChange={handleChange}
                                            value={msgData.msgText}
                                            onClick={changeMsg}
                                          ></textarea>
                                        </div>
                                        <button
                                          type="button"
                                          className="btn btn-primary"
                                          onClick={() =>
                                            submitForm(row.student.id)
                                          }
                                        >
                                          Submit
                                        </button>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* --Message Modal END -- */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {StudentData.length === 0 && (
                <>
                  <div className="mt-3 alert alert-danger" role="alert">
                    <div>
                      <i class="bi bi-exclamation-triangle-fill"></i>
                      <span className="ms-2">No students enrolled!</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserList;
