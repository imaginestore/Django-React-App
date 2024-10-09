import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const baseURL = "http://127.0.0.1:8000/api";

function EnrollStudents() {
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(baseURL + "/student/").then((res) => setStudents(res.data));
    axios.get(baseURL + "/category/").then((res) => setCategories(res.data));
  }, []);

  const fetchCoursesAndEnrollments = (categoryId, studentId) => {
    axios
      .get(baseURL + `/course/?category=${categoryId}`)
      .then((res) => setCourses(res.data.results));
    axios
      .get(baseURL + `/enrollments/${studentId}/${categoryId}/`)
      .then((res) => setEnrolledCourses(res.data.enrolled_courses));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (selectedStudent) {
      fetchCoursesAndEnrollments(categoryId, selectedStudent);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    if (selectedCategory) {
      fetchCoursesAndEnrollments(selectedCategory, studentId);
    }
  };

  const handleCourseSelection = (e) => {
    const { value, checked } = e.target;
    setSelectedCourses((prev) =>
      checked ? [...prev, value] : prev.filter((courseId) => courseId !== value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enrollmentData = {
      student: selectedStudent,
      courses: selectedCourses,
    };
    axios.post(baseURL + "/enroll/", enrollmentData).then((res) => {
      console.log(res.data);
      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "Student enrolled successfully!",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        resetForm();
      } else {
        alert("Oops!...some error occured!");
      }
    });
  };

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedCategory("");
    setCourses([]);
    setEnrolledCourses([]);
    setSelectedCourses([]);
  };

  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  const allCoursesAssigned =
    courses.length > 0 &&
    courses.every((course) => isCourseEnrolled(course.id));
  // if (loading) {
  //   return <div >Loading...</div>;
  // }
  // ----------- userEffect() end ----------------

  const msgList = {
    height: "500px",
    overFlow: "auto",
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <AdminSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Enroll Students</h5>
            <div className="card-body">
              {/* ---------------------------------------------------- */}
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="student" className="form-label fw-bold">
                  Student <span className="text-danger">*</span>
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
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label fw-bold">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  name="category"
                  id="category"
                  className="form-select"
                >
                  <option value="">Select a Grade</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              {courses.length > 0 && (
                <div className="mb-3">
                  <div className="fw-bold">
                    Subjects <span className="text-danger">*</span>
                  </div>
                  {allCoursesAssigned ? (
                    <p>
                      All courses have already been assigned to this student for
                      the selected category.
                    </p>
                  ) : (
                    courses.map((course) => (
                      <>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value={course.id}
                            onChange={handleCourseSelection}
                            disabled={isCourseEnrolled(course.id)}
                          />
                          <label class="form-check-label" key={course.id}>
                            {course.title}
                            {isCourseEnrolled(course.id) && (
                              <span className="text-danger">
                                {" "}
                                (already assigned)
                              </span>
                            )}
                          </label>
                        </div>
                      </>
                    ))
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={!selectedCourses.length}
              >
                Enroll Student
              </button>
              {/* </form> */}
              {/* ---------------------------------------------------- */}
              {/* <form>
                <label>
                  Student:
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.fullName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Category:
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </label>
                {courses.length > 0 && (
                  <fieldset>
                    <legend>Courses</legend>
                    {courses.map((course) => (
                      <label key={course.id}>
                        <input
                          type="checkbox"
                          value={course.id}
                          onChange={handleCourseSelection}
                        />
                        {course.title}
                      </label>
                    ))}
                  </fieldset>
                )}
                <button type="button" onClick={handleSubmit}>
                  Enroll Student
                </button>
              </form> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EnrollStudents;
