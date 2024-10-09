import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = `${process.env.REACT_APP_API_BASE_URL}`;

function AccessCheck() {
  const navigate = useNavigate();
  const [access, setAccess] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await axios.get(baseURL + "/check-access/");
        setAccess(response.data.access);
        if (response.data.access === "denied") {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error checking access:", error);
      }
    };
    checkAccess();
    document.title = "Access Check";
  }, []);

  if (access === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-6 offset-3">
          <h5>Access granted</h5>
          <Link to="/user-dashboard" type="button" className="btn btn-success">
            Continue to dashboard
          </Link>
          {/* {status === "error" && (
            <div className="mt-3 alert alert-danger" role="alert">
              <div>
                <i class="bi bi-exclamation-triangle-fill"></i>
                <small className="ms-2">"Error making payment"</small>
              </div>
            </div>
          )} */}
          {/* <div className="card">
            <h5 className="card-header">Access granted</h5>
            <div className="card-body"> */}
          {/* <form> */}
          {/* <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  className="form-control"
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="months_paid" className="form-label">
                  Months Paid
                </label>
                <input
                  onChange={(e) => setMonthsPaid(e.target.value)}
                  required
                  min="1"
                  type="number"
                  className="form-control"
                  name="months_paid"
                  id="months_paid"
                  value={monthsPaid}
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Make Payment
              </button> */}
          {/* </form> */}
          {/* </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AccessCheck;
