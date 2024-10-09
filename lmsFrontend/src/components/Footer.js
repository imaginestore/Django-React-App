import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Footer() {
  const [pagesData, setpagesData] = useState([]);
  // Fetch pages data when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/pages/").then((res) => {
        setpagesData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <footer className="py-3 my-5">
      <ul className="nav justify-content-center border-bottom pb-3 mb-3">
        <li className="nav-item">
          <Link to="/" className="nav-link px-2 text-body-secondary">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/faq" className="nav-link px-2 text-body-secondary">
            FAQs
          </Link>
        </li>
        {pagesData &&
          pagesData.map((row, index) => (
            <li className="nav-item">
              <Link
                to={`/pages/${row.id}${row.url}`}
                className="nav-link px-2 text-body-secondary"
              >
                {row.title}
              </Link>
            </li>
          ))}
        <li className="nav-item">
          <Link to="/contact-us" className="nav-link px-2 text-body-secondary">
            Contact Us
          </Link>
        </li>
      </ul>
      <p className="text-center text-body-secondary">
        © 2024 St. Michael's School, South Africa
      </p>
    </footer>
  );
}

export default Footer;
