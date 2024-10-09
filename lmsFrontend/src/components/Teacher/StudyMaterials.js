import React from "react";
import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function StudyMaterials() {
  const [studyData, setstudyData] = useState([]);
  const [courseTitle, setcourseTitle] = useState("");
  const [totalResult, settotalResult] = useState(0);
  const [loading, setLoading] = useState(true); // Track the loading state
  const { course_id } = useParams();
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/study-materials/" + course_id).then((res) => {
        settotalResult(res.data.study_materials.length);
        setstudyData(res.data.study_materials);
        setcourseTitle(res.data.course_title);
        console.log("Study data", res.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  // Delete data
  const handleDeleteClick = (study_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this data?",
      icon: "info",
      confirmButtonText: "Continue",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(baseURL + "/study-material/" + study_id).then((res) => {
            Swal.fire("success", "Data has been deleted.");
            try {
              axios
                .get(baseURL + "/study-materials/" + course_id)
                .then((res) => {
                  settotalResult(res.data.length);
                  setstudyData(res.data);
                });
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          Swal.fire("error", "Data has not been deleted!!");
        }
      } else {
        Swal.fire("error", "Data has not been deleted!!");
      }
    });
  };

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
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">
              {courseTitle ? courseTitle + " : " : ""}
              <span className="text-dark">
                Study Materials{" "}
                <span className="badge text-bg-primary">{totalResult}</span>
              </span>
              {/* All Study Materials ({totalResult}) */}
              <Link
                className="btn btn-success btn-sm float-end"
                to={"/add-study/" + course_id}
              >
                Add Study Material
              </Link>
            </h5>
            <div className="card-body">
              {studyData.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Uploads</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyData.map((row, index) => (
                      <tr>
                        <td>{row.title}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => downloadFile(row.upload)}
                          >
                            Download File
                          </button>
                        </td>
                        <td>{row.remarks}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(row.id)}
                            className="btn btn-sm btn-danger ms-1"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
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
export default StudyMaterials;
