import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import JoditEditor from "jodit-react";
// import HTMLReactParser from "html-react-parser";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AddChapter() {
  const [server_error, setServerError] = useState({});
  const [chapterData, setchapterData] = useState({
    title: "",
    description: "",
    video: "",
    remarks: "",
  });

  const handleChange = (event) => {
    setchapterData({
      ...chapterData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setchapterData({
      ...chapterData,
      [event.target.name]: event.target.files[0],
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
  const options = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "font",
    "fontsize",
    "|",
    "paragraph",
    "outdent",
    "indent",
    "align",
    "|",
    "hr",
    "|",
    "paste",
    "select-all",
    "|",
    "brush",
    "table",
    "link",
    "|",
    "image",
    "symbols",
    "file",
    "|",
    "copyformat",
    "eraser",
    "|",
    "subscript",
    "superscript",
    "|",
    "fullsize",
    "search",
  ];
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      defaultActionOnPaste: "insert_as_html",
      defaultLineHeight: 1.5,
      enter: "div",
      // options that we defined in above step.
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,

      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false,
      uploader: {
        url: "",
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        enableDragAndDropFileToEditor: true,
      },
      width: "auto",
      height: "auto",
      i18n: "en",
      tabIndex: -1,
      spellcheck: true,
      // toolbar: true,
    }),
    []
  );
  const [content, setContent] = useState("");
  // jodit editor code end
  const { course_id } = useParams();

  const submitForm = () => {
    const _formData = new FormData();
    _formData.append("course", course_id);
    _formData.append("title", chapterData.title);
    if (chapterData.description) {
      _formData.append("description", chapterData.description);
    }
    if (chapterData.video) {
      _formData.append("video", chapterData.video, chapterData.video.name);
    }
    if (content) {
      _formData.append("content", content);
    }
    if (chapterData.remarks) {
      _formData.append("remarks", chapterData.remarks);
    }

    // try {
    axios
      //.post(baseURL + "/chapter/", _formData, {
      .post(baseURL + "/course-chapters/" + course_id, _formData, {
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
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        //window.location.href = "/add-chapter/1";
        //window.location.reload();
        console.log(res);
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
    // } catch (error) {
    //   console.log(error);
    // }
  };
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Add Chapter</h5>
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
                  Description
                </label>
                <textarea
                  onChange={handleChange}
                  name="description"
                  id="description"
                  className="form-control"
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="video" className="form-label">
                  Video
                </label>
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="form-control"
                  name="video"
                  id="video"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="richtext" className="form-label">
                  Chapter Content <span className="text-danger">*</span>
                </label>
                {/* <CKEditor editor={ClassicEditor} /> */}
                <JoditEditor
                  ref={editor}
                  config={config}
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="remarks" className="form-label">
                  Remarks
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  placeholder="This video is based on basic introduction"
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
          {/* <div>{HTMLReactParser(content)}</div> */}
        </section>
      </div>
    </div>
  );
}

export default AddChapter;
