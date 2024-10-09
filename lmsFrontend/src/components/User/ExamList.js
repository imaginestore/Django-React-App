import React from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

const ExamListItem = ({ exam }) => {
  return (
    <tr>
      <td>{exam.exam.title}</td>
      <td>{exam.exam.description}</td>
      <td>
        <Link
          className="btn btn-sm btn-primary"
          to={`/view-marks-feedback/${exam.id}`}
        >
          View Marks and Feedback
        </Link>
      </td>
    </tr>
  );
};

function ExamList() {
  const student_id = localStorage.getItem("studentId");
  const [exams, setExams] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/student-exams/student/${student_id}/`
      );
      console.log("Exams data--->", response.data);
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  if (loading) {
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-md-12 text-center my-5">
          <div>Loading...</div>
        </div>
      </div>
    </div>;
  }

  useEffect(() => {
    document.title = "Exam List";
  });

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Exams Taken</h5>
            <div className="card-body">
              {exams.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Exam Title</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <ExamListItem key={exam.id} exam={exam} />
                    ))}
                    {/* {serverError && (
                    <p>Error fetching answers: {serverError.message}</p>
                  )} */}
                  </tbody>
                </table>
              ) : (
                <p>No exams found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ExamList;
