import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function TeacherDetail() {
  const [teacherData, setteacherData] = useState([]);
  const [courseData, setcourseData] = useState([]);
  const [skillsList, setskillsList] = useState([]);
  const [server_error, setServerError] = useState({});
  const [loading, setLoading] = useState(true); // Track the loading state
  let { teacher_id } = useParams();
  console.log("teacher_id", teacher_id);
  // Fetch courses when page loads
  useEffect(() => {
    axios
      .get(baseURL + "/teacher-profile/" + teacher_id)
      .then((res) => {
        setteacherData(res.data);
        setcourseData(res.data.teacher_courses);
        setskillsList(res.data.skills_list);
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data) {
            //console.log(error.response);
            setServerError(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          setServerError(error.message);
        }
        console.log(error.config);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after request is completed (either success or failure)
      });
  }, []);

  // console.log("server_error---->", server_error.detail);
  // console.log("courseData--->", courseData);
  // console.log("skillsList--->", skillsList);

  const iconStyle = {
    "font-size": "18px",
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
    <div className="container mt-3 mb-3">
      <div className="row">
        {/* {server_error} */}
        <div className="col-4">
          <img
            src={teacherData.profile_img}
            className="img-thumbnail"
            alt={teacherData.fullName}
          />
        </div>
        <div className="col-8">
          <h3>{teacherData.fullName}</h3>
          <p>{teacherData.detail}</p>
          <p>
            <span className="fw-bold">Qualification:&nbsp;</span>
            {teacherData.qualification}
          </p>
          <p className="fw-bold">
            <span className="fw-bold">Skills:&nbsp;</span>
            {skillsList.map((skill, index) => (
              // <>
              //   <Link
              //     to={`/teacher-skills-courses/${skill.trim()}/${
              //       teacherData.id
              //     }`}
              //     className="badge badge-pill text-dark bg-warning"
              //   >
              //     {skill.trim()}
              //   </Link>
              //   &nbsp;
              // </>
              <div className="badge badge-pill text-dark bg-warning me-1">
                {skill.trim()}
              </div>
            ))}
          </p>
          <p className="fw-bold">
            Courses uploaded:&nbsp;
            {/* Recent Course: <Link to="/category/reactjs"> ReactJs Course</Link> */}
            {courseData.map((course, index) => (
              <>
                <Link
                  key={index}
                  target="__blank"
                  to={`/detail/${course.id}`}
                  // to={`/courses-by-tech/${course.title}`}
                  className="badge badge-pill text-dark bg-info"
                >
                  {course.title}
                </Link>
                &nbsp;
              </>
            ))}
          </p>
          <p>
            {/* <small className="text-muted me-2">Follow me:</small> */}
            {teacherData.facebookURL && (
              <a href={teacherData.facebookURL}>
                <i className="bi bi-facebook" style={iconStyle}></i>
              </a>
            )}
            {teacherData.twitterURL && (
              <a href={teacherData.twitterURL}>
                <i
                  className="bi bi-twitter-x ms-2 text-dark"
                  style={iconStyle}
                ></i>
              </a>
            )}
            {teacherData.instagramURL && (
              <a href={teacherData.instagramURL}>
                <i
                  className="bi bi-instagram ms-2 text-danger"
                  style={iconStyle}
                ></i>
              </a>
            )}
            {teacherData.websiteURL && (
              <a href={teacherData.websiteURL}>
                <i
                  className="bi bi-globe ms-2 text-primary"
                  style={iconStyle}
                ></i>
              </a>
            )}
          </p>
        </div>
      </div>
      {/* Course Videos */}
      <div className="card mt-4">
        <h5 className="card-header">Course List</h5>
        <div className="list-group list-group-flush">
          {courseData.map((course, index) => (
            <Link
              to={`/detail/${course.id}`}
              className="list-group-item list-group-item-action"
            >
              {course.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
