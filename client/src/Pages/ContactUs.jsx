import React, { useState } from 'react';
import Footer from '../Footer';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can implement your logic to handle form submission
    // For example, sending the form data to a backend server
    // You can use fetch() or any other HTTP client library for this purpose
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    // After handling submission, you might want to reset the form fields
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(true); // Update state to show a confirmation message
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2>Contact Us</h2>
          {submitted ? (
            <p className="alert alert-success">Thank you for contacting us! We will get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message:</label>
                <textarea
                  id="message"
                  className="form-control"
                  value={message}
                  onChange={handleMessageChange}
                  rows={6}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;
