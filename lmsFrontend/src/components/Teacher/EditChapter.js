import React from "react";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import JoditEditor from "jodit-react";
//import HTMLReactParser from "html-react-parser";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function EditChapter() {
  const [courseId, setcourseId] = useState();
  const [loading, setLoading] = useState(true); // Track the loading state
  const [chapterData, setchapterData] = useState({
    course: "",
    title: "",
    description: "",
    prev_video: "",
    video: "",
    //  content: "",
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

  // jodit editor code start
  const editor = useRef(null);
  // ***********************************
  // const config = {
  //   readonly: false,
  //   uploader: {
  //     insertImageAsBase64URI: true,
  //   },
  //   filebrowser: {
  //     uploadUrl: "",
  //     ajax: {
  //       url: "",
  //     },
  //   },
  // };
  // *************************************
  // ************** new code for jodit config ***************
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
  // ********************************************************
  const [newContent, setnewContent] = useState("");
  // jodit editor code end

  // ********** configure to hide "powered by Jodit" in the status bar *************
  // const editor = Jodit.make("#editor", {
  //   "showCharsCounter": false,
  //   "showWordsCounter": false,
  //   "showXPathInStatusbar": false
  // });
  // ********** "powered by Jodit" configuration end ******************************

  const { chapter_id } = useParams();

  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/chapter/" + chapter_id).then((res) => {
        setchapterData({
          course: res.data.course,
          title: res.data.title,
          description: res.data.description,
          prev_video: res.data.video,
          content: res.data.content,
          remarks: res.data.remarks,
          video: "",
        });
        setcourseId(res.data.course.id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  const submitForm = () => {
    const _formData = new FormData();
    // _formData.append("course", chapterData.course.id);
    _formData.append("title", chapterData.title);
    _formData.append("description", chapterData.description);
    if (chapterData.video !== "") {
      _formData.append("video", chapterData.video, chapterData.video.name);
    }
    _formData.append("content", newContent);
    _formData.append("remarks", chapterData.remarks);

    try {
      axios
        // .put(baseURL + "/chapter/" + chapter_id, _formData, {
        .patch(baseURL + "/chapter/" + chapter_id, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Data has been updated",
              icon: "success",
              toast: true,
              timer: 3000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
          //window.location.href = "/edit-chapter/1";
        });
    } catch (error) {
      console.log(error);
    }
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
            <h5 className="card-header">Update Chapter</h5>
            <div className="card-body">
              <form>
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
                    value={chapterData.title}
                  />
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
                    value={chapterData.description}
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
                  {chapterData.prev_video && (
                    <video controls width="100%" className="mt-2">
                      <source src={chapterData.prev_video} type="video/webm" />
                      <source src={chapterData.prev_video} type="video/mp4" />
                      Sorry, your browser doesn't support embedded videos.
                    </video>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="chaptercontent" className="form-label">
                    Chapter Content
                  </label>
                  <JoditEditor
                    id="chaptercontent"
                    ref={editor}
                    config={config}
                    value={chapterData.content}
                    onChange={(newContent) => setnewContent(newContent)}
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
                    value={chapterData.remarks}
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary"
                >
                  Update
                </button>
                <Link
                  type="button"
                  to={"/all-chapters/" + courseId}
                  className="btn btn-secondary ms-3"
                >
                  Back to all Chapters
                </Link>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default EditChapter;
