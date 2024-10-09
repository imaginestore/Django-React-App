import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CourseChapters() {
  const [chapterData, setchapterData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [courseTitle, setcourseTitle] = useState("");
  const [loading, setLoading] = useState(true); // Track the loading state
  const [server_error, setServerError] = useState({});
  const { course_id } = useParams();
  // Fetch courses when page loads
  useEffect(() => {
    axios
      .get(baseURL + "/course-chapters/" + course_id)
      .then((res) => {
        settotalResult(res.data.course_chapters.length);
        setchapterData(res.data.course_chapters);
        setcourseTitle(res.data.course_title);
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
      })
      .finally(() => {
        setLoading(false); // Set loading to false after request is completed (either success or failure)
      });
  }, []);

  // Delete data
  const handleDeleteClick = (chapter_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this data?",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(baseURL + "/chapter/" + chapter_id).then((res) => {
            Swal.fire("success", "Data has been deleted.");
            try {
              axios
                .get(baseURL + "/course-chapters/" + course_id)
                .then((res) => {
                  settotalResult(res.data.length);
                  setchapterData(res.data);
                });
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          Swal.fire("error", "Data has not been deleted!!");
        }
      } else {
        Swal.fire("error", "Data has not been deleted!!");
      }
    });
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
              {courseTitle ? courseTitle + " : " : ""}
              <span className="text-dark">
                Chapters{" "}
                <span className="badge text-bg-primary">{totalResult}</span>
              </span>
              <Link
                className="btn btn-success btn-sm float-end"
                to={"/add-chapter/" + course_id}
              >
                Add Chapter
              </Link>
            </h5>
            <div className="card-body">
              {chapterData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Chapter Title</th>
                      <th>Video</th>
                      <th>Content</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapterData.map((chapter, index) => (
                      <tr>
                        <td>
                          <Link to={"/edit-chapter/" + chapter.id}>
                            {chapter.title}
                          </Link>
                        </td>
                        <td>
                          {chapter.video && (
                            <>
                              <video controls width="250">
                                <source src={chapter.video} type="video/webm" />
                                <source src={chapter.video} type="video/mp4" />
                                Sorry, your browser doesn't support embedded
                                videos!
                              </video>
                              <br />
                              <span className="mt-2">{chapter.remarks}</span>
                            </>
                          )}
                          {!chapter.video && (
                            <span>No video in this chapter</span>
                          )}
                        </td>
                        <td>
                          {chapter.content ? parse(chapter.content) : null}
                        </td>
                        <td>
                          <Link
                            to={"/edit-chapter/" + chapter.id}
                            className="btn btn-sm text-white btn-info me-2 mb-2"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(chapter.id)}
                            to={"/delete-chapter/" + chapter.id}
                            className="btn btn-sm btn-danger mb-2"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No chapter data found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default CourseChapters;
