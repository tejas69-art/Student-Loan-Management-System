import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    loan_id: '',
    student_id: '',
    amount: '',
    interest_rate: '',
    status: '',
    application_date: '',
    duration: ''
  });
  const [loanList, setLoanList] = useState([]);
  const [isManager, setIsManager] = useState(false);
  console.log(isManager)

  useEffect(() => {
    fetchLoanList();
    checkUserRole();
  }, []); // Empty dependency array to ensure the effect runs only once after initial render

  const fetchLoanList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/loans');
      setLoanList(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const checkUserRole = async () => {
    try {
      // Assuming you have an endpoint to fetch user roles
      const userId = window.localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:8000/api/roles/${userId}`); 
      console.log(response)
      const role = response.data[0].role;
      setIsManager(role === "manager");
      
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/submitLoan', formData);
      console.log('Form submitted:', formData);
      fetchLoanList(); // Refresh loan list after successful submission
      handleCloseForm();
      setFormData({
        loan_id: '',
        student_id: '',
        amount: '',
        interest_rate: '',
        status: '',
        application_date: ''
      });
    } catch (error) {
      console.error('Error submitting loan:', error);
    }
  };

  return (
    <div className="container mt-5">
    {isManager && <h1 className="mb-4">Welcome Manager !!</h1>}
      {!isManager && <h1 className="mb-4">Welcome Admin !!</h1>}
      
      {isManager && (
        <div className='container mt-2'>
        <Link to="/manager">
        <button className="btn btn-primary mb-3 mr-3" >Manager Tab</button>
        </Link>
        </div>
        
      )}
      <button className="btn btn-primary mb-3" onClick={handleButtonClick}>Fill Student Loan Details</button>
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title mb-4">Fill Student Loan Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="loanId" className="form-label">Loan ID:</label>
                <input
                  type="text"
                  id="loanId"
                  className="form-control"
                  name="loan_id"
                  value={formData.loan_id}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="studentId" className="form-label">Student ID:</label>
                <input
                  type="text"
                  id="studentId"
                  className="form-control"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="interestRate" className="form-label">Interest Rate:</label>
                <input
                  type="number"
                  id="interestRate"
                  className="form-control"
                  name="interest_rate"
                  value={formData.interest_rate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status:</label>
                <input
                  type="text"
                  id="status"
                  className="form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="applicationDate" className="form-label">Application Date:</label>
                <input
                  type="date"
                  id="applicationDate"
                  className="form-control"
                  name="application_date"
                  value={formData.application_date}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duration:</label>
                <input
                  type="integer"
                  id="applicationDate"
                  className="form-control"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
              <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      <LoanList loanList={loanList} />
    </div>
  );
}

function LoanList({ loanList }) {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Submitted Loan Details</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Student ID</th>
              <th>Amount</th>
              <th>Interest Rate</th>
              <th>Status</th>
              <th>Application Date</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {loanList.map((loan, index) => (
              <tr key={index}>
                <td>{loan.loan_id}</td>
                <td>{loan.student_id}</td>
                <td>{loan.amount}</td>
                <td>{loan.interest_rate}</td>
                <td>{loan.status}</td>
                <td>{formatDate(loan.application_date)}</td>
                <td>{loan.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export default AdminPage;
