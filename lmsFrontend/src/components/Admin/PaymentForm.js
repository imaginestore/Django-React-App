import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import Swal from "sweetalert2";
const baseURL = "http://127.0.0.1:8000/api";

function PaymentForm() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [monthsPaid, setMonthsPaid] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(baseURL + "/student/");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
    document.title = "User Payment Information";
  }, []);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(baseURL + "/payments/", {
        student: selectedStudent,
        amount,
        months_paid: monthsPaid,
      });
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Payment successful!",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        alert("Some error occured!");
      }
    } catch (error) {
      setStatus("error");
      console.error("Error making payment:", error);
    }
  };
  // End

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <AdminSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">User Payment Information Register</h5>
            <div className="card-body">
              {/* <form> */}
              <div className="mb-3">
                <label htmlFor="student" className="form-label fw-bold">
                  Student
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
                      {student.fullName} - {student.user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
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
                Update Payment
              </button>
              {/* </form> */}
            </div>
          </div>
          {status === "error" && (
            <div className="alert alert-danger mt-4" role="alert">
              <div>
                <i class="bi bi-exclamation-triangle-fill"></i>
                <span className="ms-2">Error making payment</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default PaymentForm;
