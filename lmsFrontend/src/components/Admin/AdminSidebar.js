import React from "react";
import { Link } from "react-router-dom";

function TeacherSidebar() {
  return (
    <div className="card">
      <div className="list-group list-group-flush">
        <Link
          to="/teacher-dashboard"
          className="list-group-item list-group-item-action text-bg-primary"
        >
          Admin Dashboard
        </Link>
        <Link
          to="/enroll-students"
          className="list-group-item list-group-item-action"
        >
          Enroll Students
        </Link>
        <Link
          to="/payment-form"
          className="list-group-item list-group-item-action"
        >
          Payment Form
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          Report 1
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          Report 2
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          Report 3
        </Link>
        <Link
          to="/admin-profile-settings"
          className="list-group-item list-group-item-action"
        >
          Profile Settings
        </Link>
        <Link
          to="/admin-change-password"
          className="list-group-item list-group-item-action"
        >
          Change Password
        </Link>
        <Link
          to="/admin-logout"
          className="list-group-item list-group-item-action text-danger"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default TeacherSidebar;
