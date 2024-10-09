import React from "react";
import { Link } from "react-router-dom";

function TeacherSidebar() {
  return (
    <div className="card">
      <div className="list-group list-group-flush">
        <Link
          to="/teacher-dashboard"
          className="list-group-item list-group-item-action text-light"
          style={{ backgroundColor: "#2A4E7B" }} // #2A4E7B ---> blue   #A6071C ---> red
        >
          Teacher Dashboard
        </Link>
        <Link
          to="/teacher-courses"
          className="list-group-item list-group-item-action"
        >
          My Courses
        </Link>
        <Link
          to="/add-course"
          className="list-group-item list-group-item-action"
        >
          Add Course
        </Link>
        <Link
          to="/teacher-users"
          className="list-group-item list-group-item-action"
        >
          My Users
        </Link>
        <Link to="/quiz" className="list-group-item list-group-item-action">
          Quiz
        </Link>
        <Link to="/add-quiz" className="list-group-item list-group-item-action">
          Add Quiz
        </Link>
        <Link
          to="/create-exam"
          className="list-group-item list-group-item-action"
        >
          Create Exam
        </Link>
        <Link
          to="/post-question"
          className="list-group-item list-group-item-action"
        >
          Post Question
        </Link>
        <Link
          to="/mark-exam"
          className="list-group-item list-group-item-action"
        >
          Mark Exam
        </Link>
        <Link
          to="/view-marks-feedback"
          className="list-group-item list-group-item-action"
        >
          Marks and Feedback
        </Link>
        <Link
          to="/exam-summary/"
          className="list-group-item list-group-item-action"
        >
          Exam Summary
        </Link>
        <Link
          to="/teacher-profile-settings"
          className="list-group-item list-group-item-action"
        >
          Profile Settings
        </Link>
        <Link
          to="/teacher-change-password"
          className="list-group-item list-group-item-action"
        >
          Change Password
        </Link>
        <Link
          to="/teacher-logout"
          className="list-group-item list-group-item-action text-danger"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default TeacherSidebar;
