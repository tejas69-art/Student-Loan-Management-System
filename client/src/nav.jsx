import * as React from 'react';
import { Link } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function RowAndColumnSpacing() {
  return (
    <div>
    <div className='container' >
    <h1 className='pacifico-regular'>Welcome To Student Loan Management System</h1>

    </div>
    <div className='container'>
      <div className='stu'>
        <Grid container spacing={2}>
          <Grid item xs={6} className="link-container">
            <Link to="/signin">
              <div className="link-box">
                <AccountBoxIcon
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: '64px', /* Increased icon size */
                    color: 'black'
                  }} />
                <h2 className='bebas-neue-regular'>STUDENT</h2>
              </div>
            </Link>
          </Grid>
          <Grid item xs={6} className="link-container">
            <Link to="/admin">
              <div className="link-box">
                <AccountBalanceIcon
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: '64px', /* Increased icon size */
                    color: 'black'
                  }} />
                <h2 className='bebas-neue-regular'>ADMIN</h2>
              </div>
            </Link>
          </Grid>
        </Grid>
        
      </div>
    </div>
    <div className="footer">
    <h4 className='pacifico-regular' >Made with  <FavoriteIcon fontSize='large' style={{color:'red'}}/>amcec</h4>
  </div>
   
  </div>
 
  );
}
