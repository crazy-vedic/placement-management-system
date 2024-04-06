import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentList.css';

// Assuming your initial students state is fetched from an API now
function StudentList() {
  const [students, setStudents] = useState([]);
  const [placementData, setPlacementData] = useState({ id: 0, company: '', date: '', details: '' });
  const [hidden, setHidden] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [tempEditValues, setTempEditValues] = useState({});
  const [AllPlacementData, setAllPlacementData] = useState({});

  useEffect(() => {
    axios.get('http://localhost/getdata.php')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the students data:', error);
      });
  }, []);

  const editStudent = (id) => {
    setEditingId(id);
    const student = students.find(student => student.id === id);
    setTempEditValues(student); // Initialize temporary edit values with the student's current data
  };

  const handleInputChange = (e, field) => {
    setTempEditValues({ ...tempEditValues, [field]: e.target.value });
  };

  const handleKeyPress = (e, studentId) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default action to avoid any form submission, if applicable

      axios.post('http://localhost/updateStudent.php', { ...tempEditValues, id: studentId })
        .then(response => {
          if (response.status === 200) {
            // Update was successful, update the students state
            setStudents(students.map(student => {
              if (student.id === studentId) {
                return { ...student, ...tempEditValues };
              }
              return student;
            }));
            setEditingId(null); // Exit editing mode
          }
        })
        .catch(error => {
          console.error('Failed to update student:', error);
          // Optionally handle error, e.g., show an error message
        });
    }
  };

  useEffect(() => {
    axios.get('http://localhost/getdata.php')
      .then(response => {
        console.log(response.data)        
        setStudents(response.data); 
      })
      .catch(error => {
        console.error('There was an error fetching the students data:', error);
      });
  }, []);

  const fetchPlacementData = (placementId) => {
    if (placementId === 0) {
      setHidden(true);
      return;
    }
    setHidden(false);

    axios.get(`http://localhost/placementdata.php`, { params: { id: placementId } }) // Update the URL to your actual endpoint
      .then(response => {
        setPlacementData(response.data);
        setAllPlacementData(prevData => ({...prevData, [placementId]: response.data}))
        console.log(AllPlacementData)
      })
      .catch(error => {
        console.error('There was an error fetching the placement data:', error);
      });
  };

  return (
    <div className="student-container">
      <h2>Placement Management System</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Year</th>
            <th>CGPA</th>
            <th>Skills</th>
            <th>Email</th>
            <th>Placement ID</th>
          </tr>
        </thead>
        <tbody>
        {students.map((student) => (
  <tr key={student.id} onDoubleClick={() => editStudent(student.id)}>
    <td>
      {editingId === student.id ? (
        <input 
          value={tempEditValues.name} 
          onChange={(e) => handleInputChange(e, 'name')} 
          onKeyDown={(e) => handleKeyPress(e, student.id)}
        />
      ) : (
        student.name
      )}
    </td>
    <td>
      {editingId === student.id ? (
        <input 
          value={tempEditValues.year} 
          onChange={(e) => handleInputChange(e, 'year')} 
          onKeyDown={(e) => handleKeyPress(e, student.id)}
        />
      ) : (
        student.year
      )}
    </td>
    <td>
      {editingId === student.id ? (
        <input 
          value={tempEditValues.cgpa} 
          onChange={(e) => handleInputChange(e, 'cgpa')} 
          onKeyDown={(e) => handleKeyPress(e, student.id)}
        />
      ) : (
        student.cgpa
      )}
    </td>
    <td>{student.skills}</td>
    <td>
      {editingId === student.id ? (
        <input 
          value={tempEditValues.email} 
          onChange={(e) => handleInputChange(e, 'email')} 
          onKeyDown={(e) => handleKeyPress(e, student.id)}
        />
      ) : (
        student.email
      )}
    </td>
    <td>
    <button onClick={() => fetchPlacementData(student.placement)}>
  {Object.keys(AllPlacementData).includes(student.placement.toString()) 
    ? AllPlacementData[student.placement]['company'] 
    : student.placement}
  </button>
</td>
  </tr>
))}
</tbody>
      </table>
      {!hidden && (
        <div className="placement-details">
          <button id="close-button" onClick={() => setHidden(true)}>X</button>
          <h3>Placement Details</h3>
          <p><strong>Company:</strong> {placementData.company}</p>
          <p><strong>Date:</strong> {placementData.date}</p>
          <p><strong>Details:</strong> {placementData.details}</p>
        </div>
      )}
    </div>
  );
}

export default StudentList;
