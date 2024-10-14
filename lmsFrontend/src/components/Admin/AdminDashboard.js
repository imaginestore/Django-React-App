import React from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { getUserInfo } from "../LocalStorageService";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import { Bar } from "react-chartjs-2";
const baseURL = "http://127.0.0.1:8000/api";

function AdminDashboard() {
  const [teacherData, setTeacherData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [server_error, setServerError] = useState({});
  const [dashboardData, setdashboardData] = useState([]);

  //const teacherId = localStorage.getItem("teacherId");
  // ----------- userEffect() start ----------------
  useEffect(() => {
    window.dispatchEvent(new Event("userLogin"));
    const fetchTeacherData = axios.get(baseURL + "/teacher/");
    const fetchStudentData = axios.get(baseURL + "/student/");
    const fetchCourseData = axios.get(baseURL + "/course/");

    Promise.all([fetchTeacherData, fetchStudentData, fetchCourseData])
      .then(([teachers, students, courses]) => {
        setTeacherData(teachers.data);
        setStudentData(students.data);
        setCourseData(courses.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchDashboardData = axios.get(baseURL + "/admin/dashboard/");
    fetchDashboardData
      .then(({ data }) => {
        setdashboardData(data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const data = [
    { name: "Teachers", Total: dashboardData.totalTeachers },
    { name: "Students", Total: dashboardData.totalStudents },
    { name: "Courses", Total: dashboardData.totalCourses },
    { name: "Chapters", Total: dashboardData.totalChapters },
    { name: "Exams", Total: dashboardData.totalExams },
    { name: "Quizzes", Total: dashboardData.totalQuizzes },
  ];

  if (loading) {
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-md-12 text-center my-5">
          <div>Loading...</div>
        </div>
      </div>
    </div>;
  }
  // ----------- userEffect() end ----------------
  return (
    <div className="container mb-4 mt-3">
      <div className="row">
        <aside className="col-md-3">
          <AdminSidebar />
        </aside>
        <section className="col-md-9">
          <div className="row my-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            {/* <pre>{JSON.stringify(teacherData, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(studentData, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(courseData, null, 2)}</pre> */}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
