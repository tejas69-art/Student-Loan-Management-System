
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import RepaymentForm from './Repayment';


function StudentCard({ student }) {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">{student.name}</h5>
        <p className="card-text">Age: {student.age}</p>
        <p className="card-text">ID: {student.id}</p>
        <p className="card-text">Email: {student.email}</p>
        <p className="card-text">D.O.B: {student.dob}</p>
        <p className="card-text">Enrollment Date: {student.enrollment}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <div className="card mt-2">
      <div className="card-body">
        <h5 className="card-title">{course.name}</h5>
        <p className="card-text">Course Code: {course.code}</p>
        <p className="card-text">Duration: {course.duration}</p>
        <p className="card-text">Course End Date: {course.course_end}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}

function RepaymentCard({repayment,loan}) {


  return (
    <div className='card mt-2'>
      <div className='card-body'>
        <h5 className='card-title'>Payment Details{}</h5>
        <p className='card-text'>Payment ID: {repayment.repayment_id}</p>
        <p className='card-text'>Due Amount: {repayment.due_amt}</p>
        <p className='card-text'>Paid Amount: Rs{repayment.amount}</p>
        <p className='card-tex'>Repayment Date: {formatDate(repayment.repayment_date)}</p>
      </div>
    </div>

  )


}




function LoanDetailsCard({ loan }) {

  const [showRepaymentForm, setShowRepaymentForm] = useState(false);

  const openRepaymentForm = () => {
    setShowRepaymentForm(true);
  };

  const closeRepaymentForm = () => {
    setShowRepaymentForm(false);
  }

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Loan Details</h5>
        <p className="card-text">Loan ID: {loan.id}</p>
        <p className="card-text">Amount: {loan.amount}</p>
        <p className="card-text">Interest Rate: {loan.interestRate}</p>
        {loan.status === 'Rejected' && <p className="card-text btn btn-danger">Status:{loan.status}</p>}
        {loan.status === 'Approved' && <p className="card-text btn btn-success">Status:{loan.status}</p>}
        {loan.status === 'Pending' && <p className="card-text btn btn-warning">Status:{loan.status}</p>}
        
        <p className="card-text">Application Date: {loan.applicationDate}</p>
        <p className="card-text">Loan Duration: {loan.l_duration}</p>
        <p className="card-text">Total Amount: {loan.l_total}</p>
        <p className="card-text">EMI: {loan.emi} P/M</p>
        <button className="btn btn-primary" onClick={openRepaymentForm}>Repayment</button>
      </div>
      {showRepaymentForm && (
        <RepaymentForm onClose={closeRepaymentForm} loanId={loan.id} />
      )}
    </div>
  );
}

function StudentLoanManagement() {
  const [data, setData] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const user = window.localStorage.getItem('log')
 
  

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/student_loan_details/${user}`);
        setData(response.data);
        
        const response2 = await axios.get(`http://localhost:8000/api/repayments/${response.data.loan_id}`);
        setRepayments(response2.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);
  if (!data) {
    return <div>Loading...</div>;
  }


  const student = {
    name: `${data.first_name} ${data.last_name}`,
    age: calculateAge(data.date_of_birth),
    id: data.student_id,
    email: data.email,
    dob: formatDate(data.date_of_birth),
    enrollment: formatDate(data.student_enrollment_date)

    // Add more details as needed
  };

  const course = {
    name: data.course_name,
    code: data.course_code,
    duration: "4 years",
    course_end: calculateDuration(data.course_enrollment_date)

  };

  const loan = {
    id: data.loan_id,
    amount: `RS ${data.loan_amount}`,
    interestRate: data.interest_rate,
    status: data.loan_status,
    l_duration: data.duration,
    l_total: data.total_amount,
    emi: calEMi(data.total_amount, data.duration),
    applicationDate: formatDate(data.loan_application_date),
    onRepayment: () => {
      // Add logic for handling last repayment button click
      alert('Last repayment button clicked!');
    },
  };



  return (
    <div >
      <div className='container-sm wel'>
        <h1 className='repay-h1'>Welcome Back!!</h1>
      </div>
      <div className="container mt-2">
        <div className="row row-cols-2">
          <div className="col">
            <StudentCard student={student} />
            <CourseCard course={course} />
          </div>
          <div className="col">
            <LoanDetailsCard loan={loan} />
          </div>
        </div>
      </div>
      <div className='container-sm repay'>
        <h1 className='repay-h1'>Repayments</h1>
      </div>
      <div className='container-sm wel'>
        <div className='row row-cols-3'>
          {repayments.map((repayment, index) => (
        <RepaymentCard  key={index} loan = {loan} repayment={repayment} />
      ))}
        </div>

      </div>



    </div>


  );
}

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}
function calculateDuration(courseEnrollmentDate) {
  const startDate = new Date(courseEnrollmentDate);
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 4);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return endDate.toLocaleDateString(undefined, options);
}
function calEMi(total_amount, dura) {
  const month = dura * 12
  const emi = total_amount / month;
  return emi
}


export default StudentLoanManagement;
