import React from 'react';
import Footer from '../Footer';

const AboutPage = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <h2>About Student Loan Management</h2>
          <p>Welcome to Student Loan Management, your go-to platform for managing your student loans efficiently.</p>
          <p>Our mission is to help students and graduates keep track of their loans, understand their repayment options, and ultimately achieve financial freedom.</p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <h3>Features:</h3>
          <ul>
            <li>Track your student loans</li>
            <li>Calculate repayment plans</li>
            <li>Set reminders for payment due dates</li>
            <li>Get personalized financial advice</li>
          </ul>
        </div>
        <div className="col">
          <h3>Meet the Team:</h3>
          <ul>
            <li>Tejas B P - Lead Developer</li>
            <li>H Shashidhar Reddy - UX/UI Designer</li>
            <li>T S Harshith - Backend Developer</li>
          </ul>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <h3>Contact Us:</h3>
          <p>If you have any questions, feedback, or suggestions, please don't hesitate to reach out to us at <a href="mailto:contact@studentloanmanagement.com">contact@studentloanmanagement.com</a>.</p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AboutPage;
