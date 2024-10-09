import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import JoditEditor from "jodit-react";
// import HTMLReactParser from "html-react-parser";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AddStudyMaterial() {
  const [server_error, setServerError] = useState({});
  const [studyData, setstudyData] = useState({
    title: "",
    description: "",
    upload: "",
    remarks: "",
  });

  const handleChange = (event) => {
    setstudyData({
      ...studyData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    window.URL = window.URL || window.webkitURL;
    var upload = document.createElement("upload");
    upload.src = URL.createObjectURL(event.target.files[0]);

    setstudyData({
      ...studyData,
      [event.target.name]: event.target.files[0],
    });
  };

  const { course_id } = useParams();

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    if (studyData.title) {
      _formData.append("title", studyData.title);
    }
    if (studyData.description) {
      _formData.append("description", studyData.description);
    }
    if (studyData.upload) {
      _formData.append("upload", studyData.upload, studyData.upload.name);
    }
    if (studyData.remarks) {
      _formData.append("remarks", studyData.remarks);
    }

    axios
      //.post(baseURL + "/chapter/", _formData, {
      .post(baseURL + "/study-materials/" + course_id, _formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            title: "Data has been added",
            icon: "success",
            toast: true,
            timer: 5000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        //window.location.href = "/add-chapter/1";
        window.location.reload();
        //   console.log(res);
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
            <h5 className="card-header">Add Study Material</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="title"
                  id="title"
                  className="form-control"
                />
                {server_error.title && (
                  <small className="text-danger ms-2">
                    {server_error.title ? server_error.title[0] : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  onChange={handleChange}
                  name="description"
                  id="description"
                  className="form-control"
                ></textarea>
                {server_error.description && (
                  <small className="text-danger ms-2">
                    {server_error.description
                      ? server_error.description[0]
                      : ""}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="upload" className="form-label">
                  Upload
                </label>
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="form-control"
                  name="upload"
                  id="upload"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="remarks" className="form-label">
                  Remarks
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  name="remarks"
                  id="remarks"
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
        </section>
      </div>
    </div>
  );
}

export default AddStudyMaterial;
