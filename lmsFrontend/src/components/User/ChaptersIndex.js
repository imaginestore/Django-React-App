import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import axios from "axios";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import "swiper/css/pagination"; // Pagination module styles
import { Navigation, Pagination } from "swiper/modules";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function ChaptersIndex() {
  const [chapterData, setchapterData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true); // Track the loading state
  const { course_id } = useParams();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/course-chapters/${course_id}`
        );
        const data = response.data;

        if (data && Array.isArray(data.course_chapters)) {
          setchapterData(data.course_chapters);
          settotalResult(data.course_chapters.length);
          setCourseTitle(data.course_title);
          console.log("Chapter data:---->", data.course_chapters);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchChapters();
    document.title = "Chapters Index";
  }, [course_id]);

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
              {courseTitle}:{" "}
              <span className="text-secondary">
                Index{" "}
                <span className="badge text-bg-primary">
                  {totalResult} chapters
                </span>
              </span>
            </h5>
            <div className="card-body">
              {chapterData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Video</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapterData.map((chapter, index) => (
                      <tr key={index}>
                        <td>{chapter.title}</td>
                        <td>
                          {chapter.description
                            ? chapter.description
                            : "No description"}
                        </td>
                        <td>
                          {chapter.video ? (
                            <video controls width="250">
                              <source src={chapter.video} type="video/webm" />
                              <source src={chapter.video} type="video/mp4" />
                              Sorry, your browser doesn't support embedded
                              videos!
                            </video>
                          ) : (
                            "No video in this chapter"
                          )}
                        </td>
                        <td>
                          {chapter.remarks ? chapter.remarks : "No remarks"}
                        </td>
                        <td>
                          <Link
                            to={`/student-course-chapters/${course_id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Read Chapter
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {chapterData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-danger text-center">
                          No chapters available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p>No data found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default ChaptersIndex;
