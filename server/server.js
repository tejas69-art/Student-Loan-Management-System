const express = require('express');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.use(express.json());

app.post('/api/requestOTP', async (req, res) => {
  const { username, password } = req.body;

  try {
    const queryResult = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    const user = queryResult.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    await pool.query('UPDATE users SET otp = $1 WHERE username = $2', [otp, username]);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'OTP for Login',
      text: `Your OTP for login is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
      } else {
        console.log('OTP email sent:', info.response);
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('Error occurred during OTP request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to verify OTP
app.post('/api/verifyOTP', async (req, res) => {
  const { username, otp } = req.body;

  try {
    // Query the database to verify OTP
    const queryResult = await pool.query('select * from users where username=$1 and otp=$2 ', [username,otp]);
    const user = queryResult.rows[0];
    console.log(queryResult.rowCount)

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // Clear OTP from the database
    await pool.query('UPDATE users SET otp = null WHERE username = $1', [username]);

    return res.status(200).json({ success: true,user, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error occurred during OTP verification:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//form submission
app.post('/api/submitForm', async (req, res) => {
  const { usn, firstName, lastName, email, dateOfBirth, courseName, courseCode, enrollmentDate, password } = req.body;
  try {
    const client = await pool.connect();
  
    // Insert into students table 
    const studentQuery = `
      INSERT INTO students (student_id, first_name, last_name, email, date_of_birth, enrollment_date, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const studentValues = [usn, firstName, lastName, email, dateOfBirth, enrollmentDate, password];
    await client.query(studentQuery, studentValues);
  
    // Insert into courses table
    const courseQuery = `
      INSERT INTO courses (course_name, course_code)
      VALUES ($1, $2)
    `;
    const courseValues = [courseName, courseCode];
    await client.query(courseQuery, courseValues);
  
    // Fetch course_id
    const courseResult = await client.query('SELECT course_id FROM courses WHERE course_code = $1', [courseCode]);
    const courseId = courseResult.rows[0].course_id;
  
    // Insert into enrollments table
    await client.query('INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES ($1, $2, $3)', [usn, courseId, enrollmentDate]);
  
    res.status(201).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.post('/api/submitLoan', async (req, res) => {
  try {
    const { loan_id, student_id, amount, interest_rate, status, application_date,duration } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO loans (loan_id, student_id, amount, interest_rate, status, application_date,duration) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',
      [loan_id, student_id, amount, interest_rate, status, application_date,duration]
    );
    const insertedLoan = result.rows[0];
    client.release();
    res.json(insertedLoan);
  } catch (error) {
    console.error('Error submitting loan:', error);
    res.status(500).json({ error: 'An error occurred while submitting loan details' });
  }
});

// Endpoint to fetch all submitted loan details
app.get('/api/loans', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM loans');
    const loanList = result.rows;
    client.release();
    res.json(loanList);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'An error occurred while fetching loan details' });
  }
});

///USER SIGN IN
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)

  try {
    // Fetch user with the provided email and password from the database
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM students WHERE email = $1 AND password = $2', [email, password]);
    client.release();

    const user = result.rows[0];

    if (!user) {
      // User with the provided email and password does not exist
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // User is authenticated
    res.status(200).json({ success: true, message: 'User signed in successfully', user: { email: user.email } });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ success: false, message: 'An error occurred while signing in' });
  }
});

//STUDENT DETAILS
app.get('/api/student_loan_details/:student_email', async (req, res) => {
  const { student_email } = req.params;
  try {
    const client = await pool.connect();
    const { rows: studentRows } = await client.query('SELECT STUDENT_ID FROM STUDENTS WHERE EMAIL=$1', [student_email]);

    if (studentRows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const student_id = studentRows[0].student_id;

    const query = `
    SELECT 
    students.student_id,
    students.first_name,
    students.last_name,
    students.email,
    students.date_of_birth,
    students.enrollment_date AS student_enrollment_date,
    courses.course_id,
    courses.course_name,
    courses.course_code,
    loans.loan_id,
    loans.total_amount,
    loans.duration,
    loans.amount AS loan_amount,
    loans.interest_rate,
    loans.status AS loan_status,
    loans.application_date AS loan_application_date,
    enrollments.enrollment_date AS course_enrollment_date
FROM 
    students
JOIN 
    enrollments ON students.student_id = enrollments.student_id
JOIN 
    courses ON enrollments.course_id = courses.course_id
LEFT JOIN 
    loans ON students.student_id = loans.student_id
WHERE 
    students.student_id = $1

    `;

    const { rows } = await client.query(query, [student_id]);
    res.json(rows[0]);
    client.release();
  } catch (error) {
    console.error('Error fetching student loan details:', error);
    res.status(500).json({ error: 'An error occurred while fetching student loan details' });
  }
});

//Repayments
app.post('/api/repayment', async (req, res) => {
  try {
    const { loanId, amount } = req.body;
    
    // Get the current date in the format 'YYYY-MM-DD'
    const currentDate = new Date().toISOString().slice(0, 10);

    // Assuming you have a table named 'repayments' with columns 'loan_id', 'amount', and 'repayment_date'
    const insertQuery = 'INSERT INTO repayments (loan_id, amount, repayment_date) VALUES ($1, $2, $3)';
    await pool.query(insertQuery, [loanId, amount, currentDate]);

    res.status(200).json({ success: true, message: 'Repayment recorded successfully' });
  } catch (error) {
    console.error('Error handling repayment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/repayments/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    // Assuming you have a table named 'repayments' with columns 'loan_id', 'due_amount', 'paid_amount', and 'repayment_date'
    const repaymentsQuery = 'SELECT * FROM repayments WHERE loan_id = $1';
    const { rows } = await pool.query(repaymentsQuery, [loanId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching repayments:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get("/api/roles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const rolesQuery = 'SELECT role FROM users WHERE id = $1';
    const result = await pool.query(rolesQuery, [userId]); 
    res.status(200).json(result.rows); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/api/manager", async (req, res) => {
  try {
    const managerQuery = 'SELECT * FROM students JOIN enrollments ON students.student_id = enrollments.student_id JOIN courses ON enrollments.course_id = courses.course_id LEFT JOIN loans ON students.student_id = loans.student_id';
    const result = await pool.query(managerQuery); 
    res.status(200).json(result.rows); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.put("/api/loans/approve/:studentId",async (req,res)=>{
  try {
  const {studentId} = req.params;
  const query = "update loans set status=$1 where student_id=$2"
  const stat = 'Approved'
  const result = await pool.query(query,[stat,studentId])
  console.log(result)
  res.status(200).json({success:true,message:'Loan Approved'})
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false,message:"Error While approving"})

    
  }
})

app.put("/api/loans/reject/:studentId",async (req,res)=>{
  try {
    const {studentId} = req.params;
    const query = "update loans set status=$1 where student_id=$2"
    const stat = 'Rejected'
    const result = await pool.query(query,[stat,studentId])
    res.status(200).json({success:true,message:'Loan Rejected'})
    } catch (error) {
      res.status(500).json({success:false,message:"Error While Rejecting"})
  
      
    }
  
})

app.delete("/api/delete/:studentId",async (req,res)=>{
  try {
    const {studentId} = req.params;
    const query = "DELETE FROM students WHERE student_ID=$1"
    const result = await pool.query(query,[studentId])
    res.status(200).json({success:true,message:'Loan Rejected'})
    } catch (error) {
      console.log(error)
      res.status(500).json({success:false,message:"Error While Rejecting"})
      








      
      
      
  
      
    }

})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
