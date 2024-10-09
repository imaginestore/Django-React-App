import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import "swiper/css/pagination"; // Pagination module styles
import { Navigation, Pagination } from "swiper/modules";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

const MAX_HEIGHT = 1000; // Adjust this based on your design and screen size

function StudentCourseChapters() {
  const [chapterData, setchapterData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [courseTitle, setCourseTitle] = useState("");
  const [currentChapterContent, setCurrentChapterContent] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const { course_id } = useParams();

  // Fetch course chapters when page loads
  // useEffect(() => {
  //   try {
  //     axios.get(baseURL + "/course-chapters/" + course_id).then((res) => {
  //       settotalResult(res.data.length);
  //       setchapterData(res.data);
  //       console.log("Chapter data:---->", res.data);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   document.title = "My Course";
  // }, []);

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
      }
    };

    fetchChapters();
    document.title = "Course Chapters";
  }, [course_id]);

  const chunkContent = (content, chunkSize = 1000) => {
    // Split content into chunks of given size
    const regex = new RegExp(`(.{1,${chunkSize}})(\\s|$)`, "g");
    return content.match(regex) || [];
  };

  const renderChapterContent = (content) => {
    const chunks = chunkContent(content);
    return chunks.map((chunk, index) => (
      <SwiperSlide key={index}>
        <div style={{ padding: "10px", overflow: "hidden" }}>
          {parse(chunk)}
        </div>
      </SwiperSlide>
    ));
  };

  if (chapterData.length === 0) return <div>Loading...</div>;

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <div className="card">
            <h5 className="card-header">
              {courseTitle} <span className="text-secondary">chapters</span>
            </h5>
            <div className="list-group list-group-flush">
              {chapterData.length > 0 &&
                chapterData.map((chapter, index) => (
                  <button
                    key={index}
                    className={`list-group-item list-group-item-action ${
                      selectedChapterIndex === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedChapterIndex(index)}
                  >
                    {chapter.title}
                  </button>
                ))}
              {chapterData.length === 0 && (
                <span className="text-danger text-center">
                  No chapters available
                </span>
              )}
            </div>
          </div>
        </aside>
        <section className="col-md-9">
          <div className="card">
            <div className="card-body py-2">
              {selectedChapterIndex !== null && (
                <>
                  <h5>{chapterData[selectedChapterIndex].title}</h5>
                  <p>{chapterData[selectedChapterIndex].description}</p>
                </>
              )}
              <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
              >
                {selectedChapterIndex !== null &&
                  renderChapterContent(
                    chapterData[selectedChapterIndex].content
                  )}
              </Swiper>
              {/* {//chapterData.map((chapter, index) => (
                  <SwiperSlide key={index}>
                    <div style={{ padding: "10px", overflow: "hidden" }}>
                      <h5>{chapter.title}</h5>
                      <p>{chapter.description}</p>
                      {chapter.video && (
                        <video controls width="250">
                          <source src={chapter.video} type="video/webm" />
                          <source src={chapter.video} type="video/mp4" />
                          Sorry, your browser doesn't support embedded videos!
                        </video>
                      )}
                      <p>{chapter.remarks}</p>
                      <div>
                        {renderChapterContent(
                          chapter.content,
                          index,
                          expandedIndex === index
                        )}
                      </div>
                    </div>
                    <br />
                  </SwiperSlide>
                ))} 
              </Swiper>*/}
            </div>
          </div>
        </section>
      </div>
    </div>
    // <div className="container mt-4 mb-4">
    //   <div className="row">
    //     <aside className="col-md-3">
    //       <Sidebar />
    //     </aside>
    //     <section className="col-md-9">
    //       <div className="card">
    //         <h5 className="card-header">
    //           {courseTitle}:{" "}
    //           <span className="text-secondary">
    //             chapters{" "}
    //             <span className="badge text-bg-primary">{totalResult}</span>
    //           </span>
    //         </h5>
    //         <div className="card-body">
    //           <table className="table table-bordered">
    //             <thead>
    //               <tr>
    //                 <th>Title</th>
    //                 <th>Description</th>
    //                 <th>Video</th>
    //                 <th>Remarks</th>
    //                 <th>Content</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {chapterData.map((chapter, index) => (
    //                 <tr key={index}>
    //                   <td>{chapter.title}</td>
    //                   <td>{chapter.description}</td>
    //                   <td>
    //                     <video controls width="250">
    //                       <source src={chapter.video} type="video/webm" />
    //                       <source src={chapter.video} type="video/mp4" />
    //                       Sorry, your browser doesn't support embedded videos!
    //                     </video>
    //                   </td>
    //                   <td>{chapter.remarks}</td>
    //                   <td>{chapter.content ? parse(chapter.content) : null}</td>
    //                 </tr>
    //               ))}
    //               {chapterData.length === 0 && (
    //                 <tr>
    //                   <td colSpan="5" className="text-danger text-center">
    //                     No chapters available
    //                   </td>
    //                 </tr>
    //               )}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    // </div>
  );
}
export default StudentCourseChapters;
