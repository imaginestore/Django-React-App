import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function UserStudyMaterials() {
  const [studyData, setstudyData] = useState([]);
  const [totalResult, settotalResult] = useState(0);
  const [loading, setLoading] = useState(true); // Track the loading state
  const { course_id } = useParams();
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/user/study-materials/" + course_id).then((res) => {
        settotalResult(res.data.length);
        setstudyData(res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  const downloadFile = (file_url) => {
    window.location.href = file_url;
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
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">All Study Materials ({totalResult})</h5>
            <div className="card-body">
              {studyData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Detail</th>
                      <th>Uploads</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyData.map((row, index) => (
                      <tr>
                        <td>{row.title}</td>
                        <td>{row.description}</td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => downloadFile(row.upload)}
                          >
                            Download File
                          </button>
                        </td>
                        <td>{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No study material found.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default UserStudyMaterials;
