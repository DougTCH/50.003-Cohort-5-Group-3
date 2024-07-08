import React, { useEffect } from 'react';
import Select from 'react-select';
import './LoyaltyPoints.css';
import { useState } from 'react';
//import bankLogo from 'App/src/assets/Banklogo.svg';


function LoyaltyPoints() {
  const [currentSection, setCurrentSection] = useState('') 
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputState, setInputState] = useState('initial');
  const [placeholder, setPlaceholder] = useState("Select a participating merchant");
  
  const options = [
    {value: 'move', label: 'BestMovers'},
    {value: 'city', label: 'CityGreen'},
    {value: 'fast', label: 'FastFruits'},
    {value: 'fresh', label: 'FreshBag'},
    {value: 'cart', label: 'GoCart'},
    {value: 'gold', label: 'GoldenHotels'},
    {value: 'hnh', label: 'HisAndHers'},
    {value: 'king', label: 'KingsmanServices'},
    {value: 'lion', label: 'NationalBanking'},
    {value: 'pay', label: 'PassionPay'},
    {value: 'house', label: 'PremiumSteakHouse'},
    {value: 'royal', label: 'RoyalAir'},
  ]
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '60px', // Set the height
      minHeight: '60px', // Ensure minimum height
      borderColor: state.isFocused ? '#0f1537' : '#0f1537', // Change border color on focus
      '&:hover': {
        borderColor: '#0f1537',
      },
      display: 'flex',
      alignItems: 'center',
      width: '100%', // Full width
      maxWidth: '400px',
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: '0',
      border: '1px solid #0f1537',
      width: '100%', // Full width
      maxWidth: '400px', // Optional: Limit max width to match fetch-box
    }),
    menuList: (provided) => ({
      ...provided,
      width: '100%', // Full width
      maxWidth: '400px', // Optional: Limit max width to match fetch-box
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'gray', // Customize placeholder color
      fontSize: '16px',
      fontStyle: 'italic'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black', // Customize single value color
      display: 'flex',
      alignItems: 'center',
    }),
    options: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: state.isSelected ? '#888888' : state.isFocused ? '#888888' : 'white',
      color: '#1A1E43',
     '&:hover': {
        backgroundColor: '#fffffff',
        },
  }),
};
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const handleMenuOpen = () => {
    setPlaceholder("Search by name");
  };
  const handleMenuClose = () => {
      setPlaceholder("Select a participating merchant");
  };
  const handleChange = (option) => {
    setSelectedOption(option);
    setInputState('initial'); // reset input state when new option clicked
    setInputValue1(''); // clear input value
    setInputValue2(''); // clear input value for amount
    console.log("handleChange", option);
  };
  const handleInputChange1 = (e) => {
    setInputValue1(e.target.value);
  };
  const handleInputChange2 = (e) => {
    setInputValue2(e.target.value);
  };
  const handleInputSubmit = (inputId) => {
    if (inputId === 'memIdBox') {
      console.log("Membership ID submitted with value:", inputValue1);
      if (inputValue1.trim() === '1234') {
        setInputState('validated'); // change state to 'validated' after membership ID is entered + validated
        console.log("Membership ID is valid");
      } else {
        console.log("Invalid Membership ID. Please enter '1234'.");
      }
    } else if (inputId === 'amountBox') {
      console.log("Amount submitted with value:", inputValue2);
    }
  };
  const handleKeyDown = (e, inputId) => {
    // console.log("Clicked Key: ", e.key)
    if (e.key === 'Enter') {
        handleInputSubmit(inputId);
    }
  };
  useEffect(() => {
    const memIdBox = document.getElementById('memIdBox')
    const amountBox = document.getElementById('amountBox')

    if (memIdBox) {
      memIdBox.addEventListener('keydown', handleKeyDown)
    } if (amountBox) {
      amountBox.addEventListener('keydown', handleKeyDown)
    } 
    return () => {
      if (memIdBox) {
        memIdBox.removeEventListener('keydown', handleKeyDown);
      } if (amountBox) {
        amountBox.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [inputValue1, inputValue2])

  const handleMaxClick = () => {
    setInputValue2('1000')
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <img src="" alt=""></img>
          <div className="TC-bar">
            <button className="TC-link" onClick={() => setCurrentSection('bridge')}>Bridge</button>
            <button className="TC-link" onClick={() => setCurrentSection('transaction')}>Transaction</button>
            <button className="TC-link" onClick={() => setCurrentSection('dashboard')}>Dashboard</button>
            <button className="TC-link" onClick={() => setCurrentSection('explore')}>Explore</button>
          </div>
  
          {currentSection === 'bridge' && (
            <section id="bridge-section" className="bridge-section">
              <div className="label"><p>Sender</p></div>
              <div className="fetch-box">Fetch</div>
              <div className="label"><p>Receiver</p></div>
              <Select 
                className="select-merchant-menu"
                classNamePrefix="select"
                isClearable={isClearable}
                isSearchable={isSearchable}
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
          )}
          {currentSection === 'transaction' && (
            <section id="transaction-section" className="section">
            </section>
          )}
          {currentSection === 'dashboard' && (
            <section id="dashboard-section" className="section">
            </section>
          )}
        </div> {/* Closing tag for wrapper */}
      </div> {/* Closing tag for container */}
    </>
  );
  
};



export default LoyaltyPoints;
