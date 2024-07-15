import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import SignIn from './User/signIn';

import StudentLoanManagement from './User/student';
import DrawerAppBar from './one';
import RowAndColumnSpacing from './nav';
import 'bootstrap/dist/css/bootstrap.css';
import SignupForm from './User/Signup';
import AdminPage from './Admin/Adminhome';
import AdminLogin from './Admin/Otp';
import ManagerComponent from './Admin/Manager';
import AboutPage from './Pages/AboutPage'; 
import ContactUs from './Pages/ContactUs';


const App = () => {
  

  // You can set isAuthenticated based on your authentication mechanism

  return (
    <div>
    <DrawerAppBar/>
    
      <Routes>
        <Route path='/' element={<RowAndColumnSpacing/>}/>
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/signup' element={<SignupForm/>}/>
        <Route path='/studenthome' element={<StudentLoanManagement/>}/>
        <Route path='/adminhome' element={<AdminPage/>}/>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/manager' element={<ManagerComponent/>}/>
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactUs/>} />
      </Routes>

    </div>
    
  );
};

export default App;
