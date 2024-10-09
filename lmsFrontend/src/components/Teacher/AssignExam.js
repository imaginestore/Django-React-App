import React from "react";
import TeacherSidebar from "./TeacherSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AssignExam() {
  const { course_id } = useParams();
  const teacher_id = localStorage.getItem("teacherId");
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [exams, setExams] = useState([]);
  const [assignedExams, setAssignedExams] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchAssignedExams(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(
        baseURL +
          "/fetch-enrolled-students/" +
          course_id +
          "/" +
          teacher_id +
          "/"
      );
      console.log("studentData----->", response.data);
      setEnrollmentData(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get(baseURL + "/exams/");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchAssignedExams = async (studentId) => {
    try {
      const response = await axios.get(
        baseURL + `/student-exams/?student=${studentId}`
      );
      const assignedExamIds = response.data.map((se) => se.exam.id);
      console.log("Assigned exams:", assignedExamIds); // Log assigned exams
      setAssignedExams(assignedExamIds);
      // setAssignedExams(response.data.map((se) => se.exam));
    } catch (error) {
      console.error("Error fetching assigned exams:", error);
    }
  };

  const handleAssign = async () => {
    try {
      const examAssignmentData = {
        student_id: selectedStudent,
        exam_id: selectedExam,
        course_id: course_id,
      };
      const response = await axios.post(
        baseURL + "/assign-exam/",
        examAssignmentData
      );
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Exam assigned successfully!",
          icon: "success",
          toast: true,
          timer: 5000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        fetchAssignedExams(selectedStudent); // Update assigned exams list
        resetForm();
      }
    } catch (error) {
      console.error("Error assigning exam:", error);
      Swal.fire({
        title: "Error assigning exam",
        text: error.response?.data?.error || "Something went wrong",
        icon: "error",
        toast: true,
        timer: 5000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const filteredExams = exams.filter(
    (exam) => !assignedExams.includes(exam.id)
  );
  console.log("filteredExams------->", filteredExams);

  const handleExamChange = (e) => {
    const exam_id = e.target.value;
    setSelectedExam(exam_id);
  };

  const handleStudentChange = (e) => {
    const student_id = e.target.value;
    setSelectedStudent(student_id);
  };

  const resetForm = () => {
    //setSelectedStudent("");
    setSelectedExam("");
    // setEnrollmentData([]);
  };

  const msgList = {
    height: "500px",
    overFlow: "auto",
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Assign Exam to Student</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="student" className="form-label fw-bold">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  // onChange={(e) => setSelectedStudent(e.target.value)}
                  onChange={handleStudentChange}
                  name="student"
                  id="student"
                  className="form-select"
                >
                  <option value="">Select a student</option>
                  {enrollmentData.map((row) => (
                    <option key={row.student.id} value={row.student.id}>
                      {row.student.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="exam" className="form-label fw-bold">
                  Select Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={handleExamChange}
                  name="exam"
                  id="exam"
                  className="form-select"
                >
                  <option value="">
                    {filteredExams.length === 0 ? (
                      <span className="text-danger">
                        No more exams to assign
                      </span>
                    ) : (
                      "Select an exam"
                    )}
                  </option>
                  {filteredExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAssign}
                className="btn btn-primary"
                // disabled={!selectedCourses.length}
              >
                Assign Exam
              </button>
              {/* </form> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AssignExam;
