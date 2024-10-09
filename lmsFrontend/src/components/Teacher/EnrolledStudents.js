import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function EnrolledStudents() {
  const [StudentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true); // Track the loading state

  let { course_id } = useParams();
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios
        .get(baseURL + "/fetch-enrolled-students/" + course_id)
        .then((res) => {
          setStudentData(res.data);
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
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Enrolled Students List</h5>
            <div className="card-body">
              {StudentData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Interests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {StudentData.map((row, index) => (
                      <tr>
                        <td>{row.student.fullName}</td>
                        <td>{row.student.user.email}</td>
                        <td>{row.student.user.userName}</td>
                        <td>{row.student.interestedCategories}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No student data found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EnrolledStudents;
