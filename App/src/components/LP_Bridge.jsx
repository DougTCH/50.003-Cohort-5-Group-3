import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import Modal from 'react-modal';
import { getUserData } from '../../utils/userdata';
import './LP_Bridge.css';
import { fetchLoyaltyPrograms , fetchUserPoints, sendTransaction, updateUserPoints} from '../../utils/api.jsx';
import arrowImage from '../assets/UI_ASSETS/UI_BLUE_DROPDOWN_ARROW.svg';

Modal.setAppElement('#root'); // Accessibility setting for the modal

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [points, setPoints] = useState(0);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
    user_id: '',
  });

  const generateRefNum = () => {
    // Use current timestamp for time component
    const timestamp = Date.now().toString();
  
    // Use Math.random() for a random component, converted to base 36 (0-9a-z)
    const randomComponent = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    // Combine both parts
    return `${timestamp}-${randomComponent}`;
  };

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

  useEffect(() => {
    const fetchPoints = async () => {
      try{
        const points = await fetchUserPoints(userData.user_id);
        setPoints(points)
      } catch (error) {
        console.error('Error fetching user points: ', error)
      }
    };
    if (userData.user_id){
      fetchPoints();
    }
  }, [userData.user_id])

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
        setRegexPattern(new RegExp('^[0-9]{6}$')); //just 6 numbers 
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
    currency: program.currency,
    enrol_link: program.enrol_link, 
    terms: program.terms_c_link,
    member_format: program.member_format,
    process_time: program.process_time,
    description: program.description, 
    
    
  }));

  const triggerElement = (
    <div className="collapsible-trigger">
      Transfer Breakdown   
      <img src={arrowImage} alt="arrow" className={`arrow ${isOpen ? 'open' : ''}`} />
    </div>
  );

  const handleConfirmTransaction = async () => {
    // for now set session data of points to new points
    // sessionStorage.setItem('points', userData.points - parseInt(inputValue2, 10));
    const newPoints = points - parseInt(inputValue2, 10);
    setPoints(newPoints);
    updateUserPoints(userData.user_id, newPoints)

    const formatDateToDDMMYY = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}${month}${year}`;
    };
  
    const transaction_date = formatDateToDDMMYY(new Date());

    const data = {
      "app_id": "CITY_BANK",   
      "loyalty_pid": selectedOption ? selectedOption.value : "any",
      "user_id": userData.user_id,
      "member_id": inputValue1,
      "member_first": userData.firstName, 
      "member_last": userData.lastName,
      "transaction_date": transaction_date,
      "ref_num": generateRefNum(), 
      "amount": inputValue2,
      "additional_info": "any",
    };
    console.log('sending transaction data', data);
  
    try {
      // Assuming the token is stored in sessionStorage
      const token = sessionStorage.getItem('tctoken');
      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }
  
      const result = await sendTransaction(
        data.app_id,
        data.loyalty_pid,
        data.user_id,
        data.member_id,
        data.member_first,
        data.member_last,
        data.transaction_date,
        data.ref_num,
        data.amount,
        data.additional_info,
      );
  
      console.log('Transaction successful:', result);
      alert("Transaction Successful!");
      window.location.reload();
    } catch (error) {
      console.error('Error confirming transaction:', error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <section id="bridge-section" className="bridge-section">
      <div className="label"><p>Sender</p></div>
      <div className="fetch-box">
        <p className="fetch-label">Fetch</p>
        <p className="available-points">Available: {points} Points</p>
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
      <button className='modal_button' type="button" onClick={openModal} disabled={!selectedOption}>
        More Information
      </button>
      {selectedOption && (
        <div className="input-container">
          {inputState === 'initial' ? (
            <>
              <input
                type="text"
                id="memIdBox"
                name="memIdBox"
                placeholder="Insert your Membership ID here"
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
                <p>To: {selectedOption ? selectedOption.label : ''} (+{inputValue2} {selectedOption.currency})</p>
                <p>Account Balance: {(points - parseInt(inputValue2, 10) || 0)} FETCH Points</p>
              </div>
            </Collapsible>
            <button type="button" className="confirm-transaction-button" onClick= {handleConfirmTransaction}>Confirm Transaction</button>
            <p>All transfers are final. </p>
            </>
          )}
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Loyalty Program Information"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedOption && (
          <>
            <h2>{selectedOption.label} Information</h2>
            <p>Description: {selectedOption.description || 'No description available.'}</p>
            <p>Processing Time: {selectedOption.process_time || 'N/A'}</p>
            <a href={selectedOption.enrol_link} target="_blank" rel="noopener noreferrer">Register Here</a>
            <a href ={selectedOption.terms} target = "_blank" rel = "noopener noreferrer"> Terms and Conditions</a>
           
            <button onClick={closeModal} className="close-button">Close</button>
          </>
        )}
  
      </Modal>
    </section>
  );
};

export default Bridge;
