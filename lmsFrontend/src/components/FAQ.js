import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function FAQ() {
  const [faqData, setfaqData] = useState([]);
  // Fetch courses when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/faq/").then((res) => {
        setfaqData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="container mt-3 mb-5">
      <h3 className="pb-1 mb-4">Frequently Asked Questions (FAQs)</h3>
      <div className="accordion" id="accordionExample">
        {faqData.length > 0
          ? faqData.map((row, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`collapse${index}`}
                  >
                    {row.question}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">{row.answer}</div>
                </div>
              </div>
            ))
          : "No FAQs found"}
      </div>
    </div>
  );
}

export default FAQ;
