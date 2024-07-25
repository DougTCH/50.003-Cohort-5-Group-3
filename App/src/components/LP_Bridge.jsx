import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import { getUserData } from '../../utils/userdata';
import './LP_Bridge.css';
import { fetchLoyaltyPrograms } from '../../utils/api.jsx';
import arrowImage from '../assets/UI_ASSETS/UI_BLUE_DROPDOWN_ARROW.svg';

const Bridge = ({ options, customStyles }) => {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue1, setInputValue1] = useState(''); // input membership_id
  const [inputValue2, setInputValue2] = useState(''); // input amount to transfer
  const [inputError, setInputError] = useState('');
  const [inputState, setInputState] = useState('initial');
  const [placeholder, setPlaceholder] = useState("Select a participating merchant");
  const [regexPattern, setRegexPattern] = useState(null);
  const [submitTransaction, setSubmitTransaction] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
  });

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      const programs = await fetchLoyaltyPrograms();
      setLoyaltyPrograms(programs);
    };
    fetchPrograms();
  }, []);

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
    setSubmitTransaction(false);
    if (option) {
      const selectedProgram = loyaltyPrograms.find(program => program.pid === option.value);
      if (selectedProgram && selectedProgram.pattern) {
        setRegexPattern(new RegExp(selectedProgram.pattern));
      } else {
        setRegexPattern(null);
      }
    }
  };

  const handleInputChange1 = (e) => {
    setInputValue1(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setInputValue2(e.target.value);
    if (e.target.value) {
      setSubmitTransaction(true);
    } else {
      setSubmitTransaction(false);
    }
  };

  const handleInputSubmit = (inputId) => {
    if (inputId === 'memIdBox') {
      if (regexPattern && regexPattern.test(inputValue1)) {
        setInputState('validated');
        setInputError('');
      } else {
        setInputError('Invalid membership ID.');
      }
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
    setSubmitTransaction(true);
  };

  const selectOptions = loyaltyPrograms.map(program => ({
    value: program.pid,
    label: program.name,
  }));

  const triggerElement = (
    <div className="collapsible-trigger">
      Transfer Breakdown   
      <img src={arrowImage} alt="arrow" className={`arrow ${isOpen ? 'open' : ''}`} />
    </div>
  );
  const handleConfirmTransaction = () => {
    // for now set session data of points to new points
    sessionStorage.setItem('points', userData.points - parseInt(inputValue2, 10));

    const data = {
      "app_id": "FETCH",   
      "loyalty_pid": selectedOption ? selectedOption.value : "any", //change
      "user_id": userData.id, 
      "member_id": inputValue1,
      "member_first": userData.firstName, 
      "member_last": userData.lastName,
      "transaction_date": new Date().toISOString(),
      "ref_num": "any", // change
      "amount": inputValue2,
      "additional_info": "any",
      "req": "any"
    }

    // Call the API to make the transaction
    axios.post('http://localhost:3000/transact/add_record', data)
    .then(response => {
      //notify user transaction is "successful"
    alert("Transaction Sent!");
    })
    .catch(error => {
      console.log("error: ", error)
      alert("Transaction Failed.")
    })
  }



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
        options={selectOptions}
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
          {submitTransaction && (
            <>
            <Collapsible 
              trigger={triggerElement}
              className='collapsible-breakdown' 
              triggerTagName='div' 
              transitionTime={10}
              onOpening={() => setIsOpen(true)}
              onClosing={() => setIsOpen(false)}>
              <div className="transaction-details">
                <p>From: FETCH BANK (-{inputValue2} FETCH)</p>
                <p>To: {selectedOption ? selectOptions.label : ''} (+{inputValue2} ROYAL)</p>
                <p>Account Balance: {userData.points - (parseInt(inputValue2, 10) || 0)} FETCH Points</p>
              </div>
            </Collapsible>
            <button type="button" className="confirm-transaction-button" onClick= {handleConfirmTransaction}>Confirm Transaction</button>
            <p>All transfers are final. </p>
            </>
            
          )}
        </div>
      )}
    </section>
  );
};

export default Bridge;
