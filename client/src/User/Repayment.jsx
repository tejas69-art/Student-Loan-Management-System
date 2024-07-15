import React, { useState } from 'react';
import axios from 'axios';

function RepaymentForm({ onClose, onSubmit }) {
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit =async (e) => {
    // e.preventDefault();
    try {
      // Make POST request to your Express server
      const response =  await axios.post('http://localhost:8000/api/repayment', { loanId, amount },{
        headers:{
          "content-type":"application/json"
        }
      });
    if(response.data.success){
      alert("Payment Submitted")
    }else{
      alert("Payment Error")
      
    }
      // Handle success

      console.log(response);
      
      // Optionally close the form or perform any other actions
      onClose();
    } catch (error) {
      alert("Payment Error")
      // Handle error
      console.error('Error recording repayment:', error);
    }
  };

  return (
    <div className="container mt-2" >
      <div className="form-group">
        <h2>Repayment Form</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Loan ID:
            <input type="text" value={loanId} onChange={(e) => setLoanId(e.target.value)} />
          </label>
          <label>
            Amount:
            <input style={{margin:"0.5rem"}} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
         <div className='container mt-2' style={{padding:"2px"}}>
         <button className='btn btn-primary mr-2'  type="submit">Submit</button>
          <button className='btn btn-secondary' style={{margin:"0.5rem"}} type="button" onClick={onClose}>Cancel</button>
         </div>
        </form>
      </div>
    </div>
  );
}

export default RepaymentForm;
