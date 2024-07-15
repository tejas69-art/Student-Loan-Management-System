import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Admin/Loader';
import Typography from '@mui/material/Typography';
import { Success } from '../landingPage';


const SignupForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [error, setError] = useState('');
  const [submit, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      courseName,
      courseCode,
      enrollmentDate,
      password,
      usn
    };
    try {
      const response = await axios.post('http://localhost:8000/api/submitForm', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data.success)

      if (response.data.success) {
        setSubmitted(true);
        navigate("/signin");

      } else {
        setError('Invalid Data');
      }
    } catch (error) {
      setError('Error occurred while submitting');
      console.error('Error occurred during form submission:', error);
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="form-container">
      {loading && <Loader />}
      {submit && <Success />}
      <h2>Hey!! Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>USN:</label>
          <input type="text" value={usn} onChange={(e) => setUsn(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Course Name:</label>
          <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Course Code:</label>
          <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Enrollment Date:</label>
          <input type="date" value={enrollmentDate} onChange={(e) => setEnrollmentDate(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default SignupForm;
