import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagerComponent() {
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    fetchStudentList();
  }, []);

  const fetchStudentList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/manager');
      setStudentList(response.data);
    } catch (error) {
      console.error('Error fetching student list:', error);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      // Send a PUT request to your backend API to update the status of the loan to "Approved"
      await axios.put(`http://localhost:8000/api/loans/approve/${studentId}`);
      
      // After successful approval, you may want to update the status in the frontend immediately
      setStudentList(prevList => prevList.map(student => {
        if (student.student_id === studentId) {
          return { ...student, status: 'Approved' };
        }
        return student;
      }));
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };
  
  const handleReject = async (studentId) => {
    try {
      // Send a PUT request to your backend API to update the status of the loan to "Rejected"
      await axios.put(`http://localhost:8000/api/loans/reject/${studentId}`);
      
      // After successful rejection, you may want to update the status in the frontend immediately
      setStudentList(prevList => prevList.map(student => {
        if (student.student_id === studentId) {
          return { ...student, status: 'Rejected' };
        }
        return student;
      }));
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };
  
  const handleDelete = async (studentId) => {
    try {
      // Send a DELETE request to your backend API to delete the loan
      await axios.delete(`http://localhost:8000/api/delete/${studentId}`);
      
      // After successful deletion, update the student list by filtering out the deleted student
      setStudentList(prevList => prevList.filter(student => student.student_id !== studentId));
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  return (
    <div className="table-responsive-xxl">
      <h1 className="mb-4">Manager Dashboard</h1>
      <table className="table table-striped table-bordered">
        <thead style={{textAlign:'center',fontSize:'0.1 rem'}}>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Loan Id</th>
            <th>Amount</th>
            <th>Interest Rate</th>
            <th>Status</th>
            <th>Application Date</th>
            <th>Duration</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((student) => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{student.first_name} {student.last_name}</td>
              <td>{student.email}</td>
              <td>{formatDate(student.date_of_birth)}</td>
              <td>{student.course_name}</td>
              <td>{student.course_code}</td>
              <td>{student.loan_id}</td>
              <td>{student.amount}</td>
              <td>{student.interest_rate}</td>
              <td>{student.status}</td>
              <td>{formatDate(student.application_date)}</td>
              <td>{student.duration}</td>
              <td>{student.total_amount}</td>

              <td className="btn-group">
                <button className="btn btn-success mr-2" onClick={() => handleApprove(student.student_id)}>Approve</button>
                <button className="btn btn-danger mr-2" onClick={() => handleReject(student.student_id)}>Reject</button>
                <button className="btn btn-warning" onClick={() => handleDelete(student.student_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export default ManagerComponent;
