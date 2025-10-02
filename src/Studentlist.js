import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './StudentList.css';
import { AppContext } from './Context';

//ALL OF MY EDITING OF THE DB LEADS TO AN EDIT ON THE STUDENTS IF 200, THEN THAT IS DEFINING FILTERED
//FILTERED IS DEFINING SORTING, THAT THEN DEFINES DISPLAYED STUDENTS

function StudentList() {
  const {students, setStudents,filtered, setFiltered} = useContext(AppContext);
  const [placementData, setPlacementData] = useState({ id: 0, company: '', date: '', details: '' });
  const [hidden, setHidden] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [tempEditValues, setTempEditValues] = useState({});
  const [AllPlacementData, setAllPlacementData] = useState({});
  const [sortConfig, setSortConfig] = useState({});
  const [displayedStudents, setDisplayedStudents] = useState([...students]);


  useEffect(() => {
    axios.get('http://localhost/placementManagement/getdata.php')
      .then(response => {
        const studentsWithSkillsArray = response.data.map(student => ({
          ...student,
          skills: student.skills ? student.skills.split(',') : []
        }));
        setStudents(studentsWithSkillsArray);
        setFiltered(studentsWithSkillsArray);
        console.log(studentsWithSkillsArray)
      })
      .catch(error => {
        console.error('There was an error fetching the students data:', error);
      });
  }, [setStudents,setFiltered]);


  const editStudent = (id) => {
    if (id === editingId) { setEditingId(null); return; }
    setEditingId(id);
    const student = students.find(student => student.id === id);
    setTempEditValues(student); // Initialize temporary edit values with the student's current data
  };

  const handleInputChange = (e, field) => {
    setTempEditValues({ ...tempEditValues, [field]: e.target.value });
  };

  const handleKeyPress = (e, studentId,extra=null) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault(); // Prevent the default action to avoid any form submission, if applicable
      let tempData = { ...tempEditValues };delete tempData.skills; // Remove the 'skills' property from the data to be sent
      axios.post('http://localhost/placementManagement/updateStudent.php', { ...tempData, id: studentId })
        .then(response => {
          if (response.status === 200) {
            // Update was successful, update the students state
            setStudents(students.map(student => {
              if (student.id === studentId) {
                return { ...student, ...tempEditValues ,skills:extra?[student.skills,extra]:student.skills};
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
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setEditingId(null); } });

  const fetchPlacementData = (placementId) => {
    if (placementId === 0) {
      setHidden(true);
      return;
    }
    setHidden(false);
  
    axios.get(`http://localhost/placementManagement/placementdata.php`, { params: { id: placementId } }) // Update the URL to your actual endpoint
      .then(response => {
        if (response.data.error) {
          setHidden(true);
          setAllPlacementData(prevData => ({ ...prevData, [placementId]: {"company":"Error"} }))
          console.error('There was an error fetching the placement data:', response.data.error);
        } else {
          setPlacementData(response.data);
          setAllPlacementData(prevData => ({ ...prevData, [placementId]: response.data }))
          console.log(AllPlacementData)
        }
      })
      .catch(error => {
        console.error('There was an error fetching the placement data:', error);
      });
  };  const requestSort = (key, event) => {
    event.preventDefault(); // Prevent the browser's context menu from showing up
    if (event.type === 'click') {
      // Left click: sort as before
      setSortConfig(prevConfig => {
        let direction = 'ascending';
        if (prevConfig[key] === 'ascending') {
          direction = 'descending';
        } else if (prevConfig[key] === 'descending') {
          direction = 'none';
        }
        return { ...prevConfig, [key]: direction };
      });
    } else if (event.type === 'contextmenu') {
      // Right click: remove sorting
      setSortConfig(prevConfig => {
        return { ...prevConfig, [key]: 'none' };
      });
    }
  }; const getSortDirectionIndicator = key => {
    return sortConfig[key] === 'ascending' ? '↑' : sortConfig[key] === 'descending' ? '↓' : '';
  };
  useEffect(() => {
    let sorted = [...filtered];
    Object.keys(sortConfig).forEach(key => {
      if (sortConfig[key] !== 'none') {
        sorted.sort((a, b) => {
          if (key === 'skills') {
            // Special case for 'skills'
            const aSkills = a[key];
            const bSkills = b[key];
            if (aSkills.length < bSkills.length) {
              return sortConfig[key] === 'ascending' ? -1 : 1;
            }
            if (aSkills.length > bSkills.length) {
              return sortConfig[key] === 'ascending' ? 1 : -1;
            }
          } else {
            // Default case
            if (a[key] > b[key]) {
              return sortConfig[key] === 'ascending' ? -1 : 1;
            }
            if (a[key] < b[key]) {
              return sortConfig[key] === 'ascending' ? 1 : -1;
            }
          }
          return 0;
        });
      }
    });
    setDisplayedStudents(sorted);
  }, [filtered,sortConfig,students]);
  const removeSkill = (studentId, skill) => {
    axios.post('http://localhost/placementManagement/removeSkill.php', {
      studentId: studentId,
      skill: skill.toString().trim()
    })
      .then(response => {
        if (response.status === 200) {
          setStudents(students.map(student => {
            if (student.id === studentId) {
              return { ...student, skills: student.skills.filter(s => s !== skill) };
            }
            return student;
          }));
          setEditingId(null);
        } else {
          console.error('Failed to remove skill:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error removing the skill:', error);
      });
  };

  const addSkill = (studentId, skill) => {
    axios.post('http://localhost/placementManagement/addSkill.php', {
      studentId: studentId,
      skill: skill.toString().trim()
    })
    .then(response => {
      if (response.status === 200) {
        // setStudents(students.map(student => {
        //   if (student.id === studentId) {
        //     return { ...student, skills: [...student.skills, skill] };
        //   }
        //   return student;
        // console.log(skill)
        setEditingId(null);
        return skill;
      } else {
        console.error('Failed to add skill:', response.data);
        return null
      }
    })
    .catch(error => {
      console.error('There was an error adding the skill:', error);
      return null
    });
  };
   return (
    <div className="student-container">
      <table>
        <thead>
          <tr>
            <th onClick={(event) => requestSort('id', event)} onContextMenu={(event) => requestSort('id', event)}>
              ID {getSortDirectionIndicator('id')}
            </th>
            <th onClick={(event) => requestSort('name', event)} onContextMenu={(event) => requestSort('name', event)}>
              Name {getSortDirectionIndicator('name')}
            </th>
            <th onClick={(event) => requestSort('year', event)} onContextMenu={(event) => requestSort('year', event)}>
              Year {getSortDirectionIndicator('year')}
            </th>
            <th onClick={(event) => requestSort('cgpa', event)} onContextMenu={(event) => requestSort('cgpa', event)}>
              CGPA {getSortDirectionIndicator('cgpa')}
            </th>
            <th onClick={(event) => requestSort('skills', event)} onContextMenu={(event) => requestSort('skills', event)}>
              Skills {getSortDirectionIndicator('skills')}
            </th>
            <th onClick={(event) => requestSort('email', event)} onContextMenu={(event) => requestSort('email', event)}>
              Email {getSortDirectionIndicator('email')}
            </th>
            <th onClick={(event) => requestSort('placement', event)} onContextMenu={(event) => requestSort('placement', event)}>
              Placement {getSortDirectionIndicator('placement')}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedStudents.map((student) => (
            <tr key={student.id} onDoubleClick={() => editStudent(student.id)}>
              <td>{student.id}</td>
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
              <td>
                {editingId === student.id ? (
                  <>
                    {tempEditValues.skills.map((skill, index) => (
                      <div key={index}>
                        <span>
                          <button onClick={() => removeSkill(student.id, skill)}
                            style={{ padding: '0', width: '20px', height: '20px', fontSize: '0.8em', border: 'None' ,cursor: 'pointer' }}            >
                            ❌
                          </button>
                          {skill.toString().trim()}
                          {index < tempEditValues.skills.length - 1 && ','}
                        </span>
                      </div>
                    ))}
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          addSkill(student.id, e.target.value)
                          handleKeyPress(e, student.id,e.target.value);
                          e.target.value = '';
                        }
                      }}
                      style={{ width: '100px' }}
                    />
                  </>
                ) : (
                  student.skills.join(',')
                )}
              </td>
              <td>      {editingId === student.id ? (
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
                {editingId === student.id ? (
                  <input
                    value={tempEditValues.placement}
                    onChange={(e) => handleInputChange(e, 'placement')}
                    onKeyDown={(e) => handleKeyPress(e, student.id)}
                  />
                ) : (
                  <button onClick={() => fetchPlacementData(student.placement)}>
                    {Object.keys(AllPlacementData).includes(student.placement.toString())
                      ? AllPlacementData[student.placement]['company']
                      : student.placement}
                  </button>
                )}
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
