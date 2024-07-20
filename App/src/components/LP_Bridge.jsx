import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {getUserData} from '../../utils/userdata';
import './LP_Bridge.css';
import axios from 'axios';

const Bridge = ({ options, customStyles }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue1, setInputValue1] = useState(''); // input membership_id
  const [inputValue2, setInputValue2] = useState(''); // input amount to transfer
  const [inputError, setInputError] = useState('');
  const [inputState, setInputState] = useState('initial');
  const [placeholder, setPlaceholder] = useState("Select a participating merchant");
  const [regexPattern, setRegexPattern] = useState(null);


  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
  });

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);
// note might need to run on every render, remove [] 


const fetchRegexPattern = async (pid) => {
  try {
    const response = await axios.get('https://api.example.com/loyalty-programs'); // Add the correct API URL here
    const loyalty_programs = response.data; 
    const program = loyalty_programs.find(prog => prog.pid === pid);
    if (program && program.pattern){
      setRegexPattern(new RegExp(program.pattern));
    } else {
      setRegexPattern(null);
    }
  } catch (error) {
    console.error('Error fetching regex pattern: ', error);
  }
  };
  
  const handleMenuOpen = () => {
    setPlaceholder("Search by name");
  };

  const handleMenuClose = () => {
    setPlaceholder("Select a participating merchant");
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    setInputState('initial');
    setInputValue1('');
    setInputValue2('');
    setInputError('');
    if (option) {
      fetchRegexPattern(option.value);
    }
  };

  const handleInputChange1 = (e) => {
    const value = e.target.value;
    if (regexPattern && (regexPattern.test(value) || value === '')) {
      setInputValue1(value);
      setInputError('');
    } else {
      setInputError('Invalid input.');
    }
  };

  const handleInputChange2 = (e) => {
    setInputValue2(e.target.value);
  };

  const handleInputSubmit = (inputId) => {
    if (inputId === 'memIdBox') {
      //if (inputValue1.trim() === 'ABC1234') {
        setInputState('validated');
      // }
    } else if (inputId === 'amountBox') {
      // Handle amount submission
    }
  };

  const handleKeyDown = (e, inputId) => {
    if (e.key === 'Enter') {
      handleInputSubmit(inputId);
    }
  };

  useEffect(() => {
    const memIdBox = document.getElementById('memIdBox');
    const amountBox = document.getElementById('amountBox');
    if (memIdBox) {
      memIdBox.addEventListener('keydown', (e) => handleKeyDown(e, 'memIdBox'));
    }
    if (amountBox) {
      amountBox.addEventListener('keydown', (e) => handleKeyDown(e, 'amountBox'));
    }
    return () => {
      if (memIdBox) {
        memIdBox.removeEventListener('keydown', handleKeyDown);
      }
      if (amountBox) {
        amountBox.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [inputValue1, inputValue2]);

  const handleMaxClick = () => {
    setInputValue2(userData.points.toString());
  };

  return (
    <section id="bridge-section" className="bridge-section">
      <div className="label"><p>Sender</p></div>
      <div className="fetch-box">
        <p className="fetch-label">Fetch</p>
        <p className="available-points">Available: {userData.points} Points</p>
      </div>
      <div className="label"><p>Receiver</p></div>
      <Select
        className="select-merchant-menu"
        classNamePrefix="select"
        isClearable
        isSearchable
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        value={selectedOption}
        styles={customStyles}
        onInputChange={(value, { action }) => {
          if (action === 'input-change' && value === '') {
            setSelectedOption(null);
            setInputState('initial');
          }
        }}
      />
      {selectedOption && (
        <div className="input-container">
          {inputState === 'initial' ? (
            <>
              <input
                type="text"
                id="memIdBox"
                name="memIdBox"
                placeholder="Your Membership ID e.g. ROYAL123456A"
                value={inputValue1}
                onChange={handleInputChange1}
                onKeyDown={(e) => handleKeyDown(e, 'memIdBox')}
              />
              {inputError && <p className="error">{inputError}</p>}
            </>
          ) : inputState === 'validated' && (
            <>
              <div className="label"><p>Amount You Are Sending</p></div>
              <div className="amount-container">
                <input
                  type="text"
                  id="amountBox"
                  name="amountBox"
                  placeholder="0"
                  value={inputValue2}
                  onChange={handleInputChange2}
                  onKeyDown={(e) => handleKeyDown(e, 'amountBox')}
                  
                />
                <p className="fetch-points">FETCH Points</p>
                <button type="button" id="Max" onClick={handleMaxClick}>Max</button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Bridge;
