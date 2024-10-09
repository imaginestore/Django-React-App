import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Category() {
  const [categoryData, setcategoryData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/category/").then((res) => {
        setcategoryData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

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
    <div className="container mt-3 mb-5">
      {/* Latest Courses */}
      <h3 className="pb-1 mb-4">All Categories</h3>
      <div className="row mb-4">
        {categoryData.length > 0 ? (
          categoryData.map((row, index) => (
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/course/${row.id}/${row.title}`}>
                      {row.title} ({row.total_courses} courses)
                    </Link>
                  </h5>
                  <p className="card-text">{row.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
      {/* End Latest Courses */}
    </div>
  );
}

export default Category;
