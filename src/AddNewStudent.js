import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function AddNewStudent() {
  const [notif, setNotif] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStudent = Object.fromEntries(new FormData(e.target));

    axios.post('http://localhost/placementManagement/addStudent.php', newStudent)
      .then(response => {
        if (response.data.status === 'success') {
          setNotif({ type: 'success', message: 'Student added successfully' });
        } else {
          setNotif({ type: 'error', message: response.data.message });
        }
      })
      .catch(error => {
        setNotif({ type: 'error', message: error.message });
      });
  };

  const handlePlacementSubmit = (e) => {
    e.preventDefault();

    const newPlacement = Object.fromEntries(new FormData(e.target));

    axios.post('http://localhost/placementManagement/addPlacement.php', newPlacement)
      .then(response => {
        if (response.data.status === 'success') {
          setNotif({ type: 'success', message: 'Placement added successfully\nNote: You need to update the placement ID of the student' });
        } else {
          setNotif({ type: 'error', message: response.data.message });
        }
      })
      .catch(error => {
        setNotif({ type: 'error', message: error.message });
      });
  };

  return (
    <div>
      {notif.type === 'success' && <div style={{ color: 'green' }}>{notif.message}</div>}
      {notif.type === 'error' && <div style={{ color: 'red' }}>{notif.message}</div>}
      <form onSubmit={handleSubmit}>
        <input name="id" type="number" placeholder="Student ID" required />
        <input name="name" type="text" placeholder="Name" required />
        <input name="year" type="number" placeholder="Year" required />
        <input name="cgpa" type="number" step="0.01" placeholder="CGPA" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="placement" type="number" placeholder="Placement ID" required />
        <button type="submit">Add New Student</button>
      </form>
      <br></br>
      <br></br>
      <br></br>
      <form onSubmit={handlePlacementSubmit}>
        <input name="Placement ID" type="number" placeholder="Placement ID" required />
        <input name="Student ID" type="number" placeholder="Student ID" required />
        <input name="Company" type="text" placeholder="Company" required />
        <input name="Date" type="text" placeholder="Date" required />
        <input name="Details" type="text" placeholder="Details" required />
        <button type="submit">Add New Placement</button>
      </form>
      <br/><br/><br/><Link to="/dashboard" style={{textDecoration: 'none' }}>Placement Management System</Link>
    </div>
  );
}

export default AddNewStudent;