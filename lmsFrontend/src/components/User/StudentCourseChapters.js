import React from "react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation module styles
import "swiper/css/pagination"; // Pagination module styles
import "../../SwiperStyles.css";
import { Navigation, Pagination } from "swiper/modules";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

const CHUNK_SIZE = 1200; // Rough character count per slide

function StudentCourseChapters() {
  const [chapterData, setchapterData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [currentChunk, setCurrentChunk] = useState("");
  const [currentChapterChunks, setCurrentChapterChunks] = useState([]);
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
    document.title = "Course Chapters";
  }, [course_id]);

  useEffect(() => {
    if (selectedChapterIndex !== null) {
      const chapterContent = chapterData[selectedChapterIndex].content;
      const chunks = chunkContent(chapterContent);
      setCurrentChapterChunks(chunks);
    }
  }, [selectedChapterIndex, chapterData]);

  // const chunkContent = (content) => {
  //   let chunks = [];
  //   for (let i = 0; i < content.length; i += CHUNK_SIZE) {
  //     chunks.push(content.slice(i, i + CHUNK_SIZE));
  //   }
  //   return chunks;
  // };

  // Helper function to prevent breaking after abbreviations or inside quotes
  const preventOrphanedWords = (text) => {
    // Prevent breaking after titles like Mr., Mrs., etc.
    return (
      text
        // .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St)\.(\s)/g, "$&\u00A0")
        // .replace(/(?<=\.\s)"|\.\s'/g, ".\u00A0")
        // .replace(/\.\s(?=[A-Z])/g, ".\u00A0") // Handle period followed by space if followed by capital letter (potential new sentence)
        // .replace(/\.\s"|\.\s'/g, ".\u00A0") // Handle period followed by space and quote
        .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St)\.(\s)/g, "$1.\u00A0") // Handle abbreviations like "Mr." with a non-breaking space
        .replace(/(?<=\.\s)(?=[A-Z])/g, "\u00A0") // Handle period followed by space if followed by a capital letter
        .replace(/(?<=\.\s)"|\.\s'/g, ".\u00A0") // Handle period followed by space and quote
    );
  };
  // ===========================================================
  const chunkContent = (content, chunkSize = 1100) => {
    const cleanedContent = preventOrphanedWords(content);
    const sentences = cleanedContent.match(/[^.!?]+[.!?]"?\s*/g) || [];

    const chunks = [];
    let currentChunk = "";
    let formattingTags = "";

    sentences.forEach((sentence) => {
      const sentenceWithoutTags = sentence.replace(/<[^>]*>/g, "");
      if ((currentChunk + sentenceWithoutTags).length <= chunkSize) {
        currentChunk += sentence;
      } else {
        let trimmedChunk = currentChunk.replace(/\s+/g, " ").trim();
        trimmedChunk = trimmedChunk.replace(/^<br\s*\/?>/, "");
        chunks.push(trimmedChunk + formattingTags); // Add only non-empty chunks
        currentChunk = sentence;
        formattingTags = sentence.match(/<[^>]*>/g)?.join("") || "";
      }
    });
    // Push the last chunk if there's any remaining content
    let trimmedChunk = currentChunk.replace(/\s+/g, " ").trim();
    trimmedChunk = trimmedChunk.replace(/^<br\s*\/?>/, ""); // Remove leading <br> tags
    if (trimmedChunk) {
      chunks.push(trimmedChunk + formattingTags);
    }
    return chunks;
  };

  const renderChapterContent = (content) => {
    // const chunks = chunkContent(content);
    // return chunks.map((chunk, index) => (
    const chunks = chunkContent(content);
    return chunks.map((chunk, index) => (
      <SwiperSlide key={index}>
        <div
          style={{
            padding: "0 0 40px 0",
            marginTop: "0",
            height: "auto", // Adjust as needed for consistency
            overflow: "hidden",
            minHeight: "calc(100% - 50px)",
            //maxHeight: "500px", // Ensures maximum slide height
            boxSizing: "border-box", // Ensures padding is included in width/height
            // alignItems: "center",
            // justifyContent: "center"
          }}
          onMouseEnter={() => setCurrentChunk(chunk)}
        >
          {parse(chunk)}
        </div>
      </SwiperSlide>
    ));
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  function speak(text) {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1; // Adjust the rate (0.1 to 10)
      speech.pitch = 1; // Adjust the pitch (0 to 2)
      speech.lang = "en-US"; // Set the language

      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop all current and queued speech
    }
  }

  const iconStyle = {
    "font-size": "30px",
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
                  <h5 className="mt-2">
                    {chapterData[selectedChapterIndex].title}
                    <span className="p-0 m-0 bg-body-tertiary float-end rounded">
                      <Link to="#">
                        <i
                          className="bi bi-volume-mute btn"
                          onClick={stopSpeech}
                          title="Click to stop"
                        ></i>
                      </Link>
                      <Link to="#">
                        <i
                          className="bi bi-volume-up btn"
                          onClick={() =>
                            speak(
                              currentChunk
                                .replace(/<[^>]*>/g, "")
                                .replace("&nbsp", " ")
                            )
                          }
                          // style={{ iconStyle }}
                          title="Click to listen"
                        ></i>
                      </Link>
                    </span>
                  </h5>
                  <p className="mb-0">
                    {chapterData[selectedChapterIndex].description}
                  </p>
                  {/* -- Detect if video uploaded in this chapter -- */}
                  {chapterData[selectedChapterIndex].video && (
                    <div className="float-end mb-1">
                      <span>
                        <span className="me-2 text-primary">
                          {chapterData[selectedChapterIndex].remarks}
                        </span>
                        <button
                          className="btn btn-sm btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#videoModal1"
                        >
                          <i className="bi-youtube"></i>
                        </button>
                      </span>
                      {/* -- Video Modal Start -- */}
                      <div
                        className="modal fade"
                        id="videoModal1"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-xl">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                {chapterData[selectedChapterIndex].remarks}
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="ratio ratio-16x9">
                                {/* <iframe
                                  src={chapterData[selectedChapterIndex].video}
                                  title={
                                    chapterData[selectedChapterIndex].title
                                  }
                                  allowFullscreen
                                ></iframe> */}
                                <video
                                  key={chapterData[selectedChapterIndex].video}
                                  controls
                                >
                                  <source
                                    src={
                                      chapterData[selectedChapterIndex].video
                                    }
                                    type="video/mp4"
                                  />
                                  <source
                                    src={
                                      chapterData[selectedChapterIndex].video
                                    }
                                    type="video/webm"
                                  />
                                  Your browser does not support the embedded
                                  videos!
                                </video>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -- Video Modal End -- */}
                    </div>
                  )}
                </>
              )}
              <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={pagination}
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
