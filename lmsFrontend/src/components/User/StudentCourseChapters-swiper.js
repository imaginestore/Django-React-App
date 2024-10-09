import { Link } from "react-router-dom";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import "swiper/css/pagination"; // Pagination module styles
import { Navigation, Pagination } from "swiper/modules";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

const CHUNK_SIZE = 1200; // Rough character count per slide

function StudentCourseChapters() {
  const [chapterData, setchapterData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [currentChapterChunks, setCurrentChapterChunks] = useState([]);
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
      }
    };

    fetchChapters();
    document.title = "Course Chapters";
  }, [course_id]);

  useEffect(() => {
    if (selectedChapterIndex !== null) {
      const chapterContent = chapterData[selectedChapterIndex].content;
      const chunks = chunkContent(chapterContent);
      setCurrentChapterChunks(chunks);
    }
  }, [selectedChapterIndex, chapterData]);

  const chunkContent = (content) => {
    let chunks = [];
    for (let i = 0; i < content.length; i += CHUNK_SIZE) {
      chunks.push(content.slice(i, i + CHUNK_SIZE));
    }
    return chunks;
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

  if (chapterData.length === 0) {
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default StudentCourseChapters;
