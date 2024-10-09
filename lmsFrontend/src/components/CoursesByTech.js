import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function CoursesByTech() {
  const { tech } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // const response = await axios.get(baseURL + `/courses-by-tech/${tech}/`);
        const response = await axios.get(
          baseURL + "/courses-by-tech/" + tech + "/"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCourses();
  }, [tech]);

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
    <div className="container mt-4">
      <h3 className="pb-1 mb-4">Courses related to {tech}</h3>
      <div className="row mb-4">
        <div className="row">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div className="col-md-3" key={course.id}>
                <div className="card">
                  <Link target="__blank" to={`/detail/${course.id}`}>
                    <img
                      src={course.featured_img}
                      className="card-img-top"
                      alt={course.title}
                    />
                  </Link>
                  <div className="card-body text-bg-primary py-1">
                    <h5 className="card-title text-center">
                      <Link
                        className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                        to={`/detail/${course.id}`}
                      >
                        {course.title}
                      </Link>
                    </h5>
                  </div>
                  <div className="card-footer">
                    <div className="title text-center">
                      {course.category.title}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No related courses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesByTech;
