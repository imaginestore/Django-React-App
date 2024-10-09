import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function TeacherRegisterSuccessMessage() {
  useEffect(() => {
    document.title = "Teacher Registration process";
  });
  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-7 offset-3">
          <div className="mb-3">
            <div className="mt-3 alert alert-success" role="alert">
              <div>
                <i className="bi bi-check-circle-fill me-2"></i>
                Registration successful!
              </div>
            </div>
          </div>
          <div className="mb-3 text-center">
            <p>
              Please take a momemnt to tell us more about yourself.
              <br />
              Click <span className="alert-link text-success">Next</span> button
              to complete the registration process.
            </p>
          </div>
          <div className="mb-3 text-center">
            <Link
              type="button"
              to="/teacher-personal-info-register/"
              className="btn btn-success btn-lg"
            >
              <span className="me-2">Next</span>
              <i class="bi bi-check-circle-fill"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherRegisterSuccessMessage;
