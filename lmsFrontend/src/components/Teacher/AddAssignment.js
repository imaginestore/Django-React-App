import React from "react";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import JoditEditor from "jodit-react";
// import HTMLReactParser from "html-react-parser";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AddAssignment() {
  const [server_error, setServerError] = useState({});
  const [assignmentData, setassignmentData] = useState({
    title: "",
    detail: "",
  });

  const handleChange = (event) => {
    setassignmentData({
      ...assignmentData,
      [event.target.name]: event.target.value,
    });
  };
  // const handleEditorChange = (e, editor) => {
  //   const data = editor.getData();
  //   //setchapterData(data);
  //   setchapterData({
  //     ...chapterData,
  //     [e.CKEditor.data]: data,
  //   });
  // };
  // ************************************************/
  // jodit editor code start
  const editor = useRef(null);
  const [content, setContent] = useState("");
  // jodit editor code end
  const { student_id } = useParams();
  const { teacher_id } = useParams();

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("teacher", teacher_id);
    if (assignmentData.title) {
      _formData.append("title", assignmentData.title);
    }
    if (assignmentData.detail) {
      _formData.append("detail", assignmentData.detail);
    }
    _formData.append("student", student_id);

    axios
      .post(
        baseURL + "/student-assignment/" + teacher_id + "/" + student_id,
        _formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Assignment has been added",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        // Save Notification data
        const _notifData = new FormData();
        _notifData.append("teacher", teacher_id);
        _notifData.append("notifSubject", "assignment");
        _notifData.append("notifFor", "student");
        _notifData.append("student", student_id);
        axios
          .post(baseURL + "/save-notification/", _notifData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log("Notification Added");
          });
        // End Notification
        window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data) {
            console.log("---------------error.response.data-------------");
            console.log(error.response.data);
            setServerError(error.response.data);
          }
        } else if (error.request) {
          console.log("---------------error.request-------------");
          console.log(error.request);
        } else {
          console.log("---------------error.message-------------");
          setServerError(error.message);
        }
        console.log(error.config);
      });
  };
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Add Assignment</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="title"
                  id="title"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="detail" className="form-label">
                  Detail
                </label>
                <textarea
                  onChange={handleChange}
                  name="detail"
                  id="detail"
                  className="form-control"
                ></textarea>
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Submit
              </button>
              {/* </form> */}
            </div>
          </div>
          {/* <div>{HTMLReactParser(content)}</div> */}
        </section>
      </div>
    </div>
  );
}

export default AddAssignment;
