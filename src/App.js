import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';
import StudentList from './Studentlist';
import { AppContext } from './Context';
import Filterbox from './Filterbox';
import AddNewStudent from './AddNewStudent'; // Import the new component

function App() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  return (
    <AppContext.Provider value={{ students, setStudents, filtered, setFiltered }}>
      <Router>
        <div className="App">
        <h1 style={{"textAlign": "center","color": "#0275d8"}}>
  <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
    Placement Management System
  </Link>
</h1>
          <Routes>
            <Route path="/dashboard" element={<><Filterbox /><StudentList /><Link to="/addNewStudent" style={{textDecoration:'none'}}>Add a new student</Link></>} />
            <Route path="/addNewStudent" element={<><AddNewStudent /></>}/>
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;