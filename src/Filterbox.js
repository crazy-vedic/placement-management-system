// FilterBox.js
import React, { useState ,useContext, useEffect} from 'react';
import './Filterbox.css'; // Import the CSS file
import { AppContext } from './Context';

function FilterBox() {
  const {students, setFiltered} = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    year: '',
    cgpa: '',
    skill: '',
    placement: ''
  });
  const [tempFilters, setTempFilters] = useState({
    id: '',
    name: '',
    year: '',
    cgpa: '',
    skill: '',
    placement: ''
  });

  const handleInputChange = (event) => {
    let value = event.target.value;
  
    if (['id', 'year', 'placement'].includes(event.target.name)) {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        value = '';
      }
    }
  
    setTempFilters({
      ...tempFilters,
      [event.target.name]: value
    });
  
    console.log(filters);
  };  

  const updateFilters = () => {
    setFilters(tempFilters);
    };

  const handleFilterChange = (filt=null) => {
        const usedFilter = filt||filters
        console.log(`Filtering`);
        console.log(usedFilter);
        const filteredStudents = students.filter(student => {
        if (usedFilter.id !== '' && student.id !== usedFilter.id) {
            return false;
        }
        if (usedFilter.name !== '' && !student.name.toLowerCase().includes(usedFilter.name.toLowerCase())) {
            return false;
        }
        if (usedFilter.year !== '' && student.year !== usedFilter.year) {
            return false;
        }
        if (usedFilter.cgpa !== '' && student.cgpa <= usedFilter.cgpa) {
            return false;
        }
        if (usedFilter.skill !== '') {
            const skills = usedFilter.skill.split(',').map(skill => skill.trim().toLowerCase());
            // console.log(`required: ${skills.join(',')}`);
            if (!skills.every(skill => student.skills.map(TEMPSKILL => {return TEMPSKILL.toLowerCase().trim()}).includes(skill))) {
              return false;
            }
          }
        if (usedFilter.placement !== '' && student.placement !== usedFilter.placement) {
            return false;
        }
        return true;
        });
        setFiltered(filteredStudents);
};

useEffect(() => {
    handleFilterChange();//eslint-disable-next-line
},[students])

  return (
    <div className={`filter-box ${isOpen ? 'open' : ''}`}>
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)} style={{cursor:"pointer"}}>
        <button  style={{marginRight:"2.5vw",height:"2vh",background:"transparent",border:"none",cursor:"pointer"}}>
          {isOpen ? '∇' : '△'}
        </button>
      </div>
      {isOpen && (
        <div className="filter-content">
          {Object.keys(filters).map(key => (
            <div key={key} className='labelInput' style={{marginRight:"0.1vw"}}>
            <label style={{marginRight:"0.5vw"}}>
              {key.toUpperCase()}:
            </label>
              <input
                type="text"
                name={key}
                value={tempFilters[key]}
                onChange={handleInputChange}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.target.value='';
                    handleInputChange(e);
                    updateFilters();
                    handleFilterChange({ ...filters, [key]: '' });
                }}
                onKeyDown={(e) => {if (e.key === 'Enter') {updateFilters();handleFilterChange(tempFilters);e.stopPropagation();}}}
              />
            </div>
          ))}
          <button onClick={handleFilterChange}>
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterBox;