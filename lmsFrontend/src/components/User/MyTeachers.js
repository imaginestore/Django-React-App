import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserMessagesList from "./UserMessagesList";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function MyTeachers() {
  const [teacherData, setteacherData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  const studentId = localStorage.getItem("studentId");

  // Fetch students when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/fetch-my-teachers/" + studentId).then((res) => {
        console.log("res.data", res.data);
        setteacherData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
    document.title = "My Teachers";
  }, []);

  const [msgData, setmsgData] = useState({
    msgText: "",
  });

  const [groupMsgData, setgroupMsgData] = useState({
    msgText: "",
  });

  const [successMsg, setsuccessMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");

  const [groupSuccessMsg, setgroupSuccessMsg] = useState("");
  const [groupErrorMsg, setgroupErrorMsg] = useState("");

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
  const submitForm = (teacher_id) => {
    const _formData = new FormData();
    _formData.append("msgText", msgData.msgText);
    _formData.append("msgFrom", "student");
    try {
      axios
        .post(
          baseURL + "/send-message/" + teacher_id + "/" + studentId,
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
    _formData.append("msgFrom", "student");

    try {
      axios
        .post(
          baseURL + "/send-group-message-from-student/" + studentId,
          _formData
        )
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
    height: "300px",
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
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              My Teachers{" "}
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
                      Send Message to All Teachers
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
              {teacherData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherData.map((row, index) => (
                      // row.teacher.id
                      <tr>
                        <td className="py-auto">
                          <Link to={`/teacher-detail/` + row.id}>
                            {row.fullName}
                          </Link>
                        </td>
                        <td className="py-0">
                          {/* <button
                          className="btn btn-sm btn-primary mb-2"
                          title="Send Message"
                          data-bs-toggle="modal"
                          data-bs-target={`#msgModal${index}`}
                        > */}{" "}
                          <i
                            className="bi bi-chat-fill btn text-primary"
                            title="Send Message"
                            data-bs-toggle="modal"
                            data-bs-target={`#msgModal${index}`}
                          ></i>
                          {/* </button> */}
                          {/* Message modal */}
                          <div
                            className="modal fade"
                            id={`msgModal${index}`}
                            tabindex="-1"
                            aria-labelledby="msgModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-xxl-down">
                              <div className="modal-content">
                                <div className="modal-header bg-dark">
                                  <h1
                                    className="modal-title fs-4"
                                    id="msgModalLabel"
                                  >
                                    <span className="text-white">
                                      {row.fullName}
                                    </span>
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close-white text-white"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    title="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div className="row">
                                    <div
                                      className="col-md-8 mb-2 col-12 border-end"
                                      style={msgList}
                                    >
                                      <UserMessagesList
                                        teacher_id={row.id}
                                        student_id={studentId}
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
                                          onClick={() => submitForm(row.id)}
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
              ) : (
                <p>No teacher data found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyTeachers;
