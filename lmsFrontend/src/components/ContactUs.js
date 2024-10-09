import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api/contact/";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}/contact/`;

function ContactUs() {
  const [contactData, setcontactData] = useState({
    fullName: "",
    email: "",
    queryText: "",
    status: "",
  });
  // Change Element Value
  const handleChange = (event) => {
    setcontactData({
      ...contactData,
      [event.target.name]: event.target.value,
    });
  };
  // End

  // Submit form
  const submitForm = () => {
    const contactFormData = new FormData();
    contactFormData.append("fullName", contactData.fullName);
    contactFormData.append("email", contactData.email);
    contactFormData.append("queryText", contactData.queryText);

    try {
      axios.post(baseURL, contactFormData).then((response) => {
        setcontactData({
          fullName: "",
          email: "",
          queryText: "",
          status: "success",
        });
      });
    } catch (error) {
      console.log(error);
      setcontactData({ status: "error" });
    }
  };
  // End

  const liststyle = {
    liststyle: "none",
  };

  useEffect(() => {
    document.title = "Contact Us";
  });

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        {/* Left panel start */}
        <div className="col-4 offset-1">
          <h4 className="border-bottom mb-3 pb-2">Contact Details</h4>
          <ul className="ist-group list-group-horizontal m-0 p-0">
            <li className="list-group-item">
              <label className="fw-bold">Address:</label>
              <span className="ms-2">
                9, Cooke Street, Golf View,
                <br /> Mafikeng - 2745
              </span>
            </li>
            <li className="list-group-item mt-2">
              <label className="fw-bold">Mobile No:</label>
              <span className="ms-2">0123456789</span>
            </li>
            <li className="list-group-item mt-2">
              <label className="fw-bold">Email:</label>
              <span className="ms-2 text-primary">
                stmichalschool@gmail.com
              </span>
            </li>
          </ul>
        </div>
        {/* Left panel end */}
        <div className="col-7">
          {contactData.status === "success" && (
            <p className="text-success">Thanks you for contacting us</p>
          )}
          {contactData.status === "error" && (
            <p className="text-danger">Something went wrong!</p>
          )}
          <div className="card">
            <h5 className="card-header">Contact Us</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  name="fullName"
                  id="fullName"
                  value={contactData.fullName}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  className="form-control"
                  name="email"
                  id="email"
                  value={contactData.email}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="queryText" className="form-label">
                  Query
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  name="queryText"
                  id="queryText"
                  rows="10"
                  value={contactData.queryText}
                ></textarea>
              </div>

              <button
                type="submit"
                onClick={submitForm}
                className="btn btn-primary"
              >
                Send
              </button>
              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
