import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function Page() {
  const [pagesData, setpagesData] = useState([]);
  let { page_id, page_slug } = useParams();
  // Fetch pages data when page loads
  useEffect(() => {
    try {
      axios.get(baseURL + "/pages/" + page_id + "/" + page_slug).then((res) => {
        setpagesData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [page_id]);

  return (
    <div className="container mt-4">
      <h2>{pagesData.title}</h2>
      <p>{pagesData.content}</p>
    </div>
  );
}

export default Page;
