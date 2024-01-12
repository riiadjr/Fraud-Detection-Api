
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import myimage from './check.png';
import myimage2 from './multiply.png';

function App() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSecondPopupVisible, setSecondPopupVisible] = useState(false);
  const [isThirdPopupVisible, setThirdPopupVisible] = useState(false);
  const [isForthPopupVisible, setForthPopupVisible ] =useState(false)
  const [isToggleButtonVisible, setToggleButtonVisible] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cityPopulation, setCityPopulation] = useState('');
  const [job, setJob] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [Expiration, setExpiration] = useState('');
  const [CVC, setCvc]= useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [age, setAge] = useState(0);
  const [isPaymentSuccessful, setPaymentSuccessful] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState('');


  const closeAllPopups = () => {
    setPopupVisible(false);
    setSecondPopupVisible(false);
    setThirdPopupVisible(false);
    setForthPopupVisible(false)
  };

  const togglePopup = () => {
    closeAllPopups();
    setPopupVisible(!isPopupVisible);
    setToggleButtonVisible(false);
  };

  const toggleSecondPopup = () => {
    if (firstName.trim() !== '' && lastName.trim() !== '' && gender.trim() !== '' && street.trim()!==''  ) {
      closeAllPopups();
      setSecondPopupVisible(!isSecondPopupVisible);
      setToggleButtonVisible(false);
    } else {
      alert('Please enter client information before proceeding to the second pop-up.');
    }
  };



  const toggleThirdPopup = () => {
    // Check if the entered Visa card number is valid
   
    if (isVisaCardNumberValid(creditCardNumber)) {
        if (   Expiration.trim() !== '' &&
        creditCardNumber.trim() !== ''&&
        CVC.trim() !=='' 
        ) {
            closeAllPopups();
            setThirdPopupVisible(!isThirdPopupVisible);
            setToggleButtonVisible(false);
        }
        else{
            alert('Please enter all credit card information before proceeding to the third pop-up.');
        }
    } else{
          // Display an error message or handle invalid card number
      // You may choose to set an error state, show a message, or take other actions
        alert('Invalid Visa card number');
    }


  };


 

  const toggleForthPopup = async () => {
    if (
      selectedCoordinates !== null &&
      category.trim() !== '' &&
      amount.trim() !== ''
    ) {
      await handlePostRequest();
      closeAllPopups();
     
      setForthPopupVisible(!isForthPopupVisible);
      setToggleButtonVisible(false);
    } else {
      alert('Please enter all  product information before proceeding to the forth pop-up.');
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleZipChange = (e) => {
    setZip(e.target.value);
  };

  const handleLatitudeChange = (e) => {
    setLatitude(e.target.value);
  };

  const handleLongitudeChange = (e) => {
    setLongitude(e.target.value);
  };

  const handleCityPopulationChange = (e) => {
    setCityPopulation(e.target.value);
  };

  const handleJobChange = (e) => {
    setJob(e.target.value);
  };

  const handleDateOfBirthChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  const handleExpiration = (e) => {
    setExpiration(e.target.value);
  };
  const handleCvc =(e)=>{
    setCvc(e.target.value);
  }

  const isVisaCardNumberValid = (cardNumber) => {
    // Visa card number pattern
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
  
    // Remove non-numeric characters
    const numericCardNumber = cardNumber.replace(/\D/g, '');
  
    // Check if the card number matches the Visa pattern
    return visaPattern.test(numericCardNumber);
  };

  const handleCreditCardNumberChange = (e) => {

    setCreditCardNumber(e.target.value);
  };


  const countries = [
    { key: 'USA', coordinates: { latitude: 37.0902, longitude: -95.7129 } },
    { key: 'Canada', coordinates: { latitude: 56.1304, longitude: -106.3468 } },
    { key: 'China', coordinates: { latitude: 35.8617, longitude: 104.1954 } },
    { key: 'United Kingdom', coordinates: { latitude: 55.3781, longitude: 3.4360 } },
    { key: 'Australia', coordinates: { latitude: -25.2744, longitude: 133.7751 } },
    { key: 'Algeria', coordinates: { latitude: 28.0339, longitude: 1.6596 } },
    // Add more countries as needed
  ];

  const handleMerchantChange = (e) => {
    const selectedCountryKey = e.target.value;
    const selectedCountry = countries.find((country) => country.key === selectedCountryKey);
  
    setSelectedCoordinates(selectedCountry ? selectedCountry.coordinates : null);
  };
  

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

 
  const limitInputLength = (element, maxLength) => {
    const elementtype = typeof element;
  
    if (elementtype !== 'string') {
      const inputValue = element.value.toString();
      if (inputValue.length > maxLength) {
        element.value = inputValue.slice(0, maxLength);
      }
      else 
      if (elementtype === 'string') {
        element.value=''
        
      } 
    } 
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    let calculatedAge = currentDate.getFullYear() - dob.getFullYear();

    if (
      currentDate.getMonth() < dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
    ) {
      calculatedAge--;
    }

    return calculatedAge;
  };

  useEffect(() => {
    if (dateOfBirth.trim() !== '') {
      setAge(calculateAge(dateOfBirth));
    }
  }, [dateOfBirth, age]);

  const handlePostRequest = async () => {
    const data = {
 
      age: age,
      gender: gender,
      category: category,
      amount: amount,
      merchant: selectedCoordinates,
    };

    try {
      const response = await fetch('https://fraud-detection-api.vercel.app/detect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const isFraud = result.fraud;

      setPaymentSuccessful(!isFraud);
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
   
  
  

  return (
    <div className="popup-container">
      {isToggleButtonVisible && (
        <button onClick={togglePopup}>payment</button>
        
      )}

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>CLIENT INFORMATIONS</h2>
         
            <div className='line_1'>
            <label>
              First Name:
              <input type="text" value={firstName} onChange={handleFirstNameChange} />
            </label>
            <label>
              Last Name:
              <input type="text" value={lastName} onChange={handleLastNameChange} />
            </label>
         <div className='line'>
         Gender:
            <div className='gender_input'>
                  <div className='gender'>
                  <p>Male</p>
                      <input type="radio" name="gender" value="M" onChange={handleGenderChange} />
                  </div >
                  <div  className='gender'>
                    <p>Female</p>
                      <input type="radio" name="gender" value="F" onChange={handleGenderChange}/> 
                  </div>
            </div>
         </div>
            <label>
              Date of Birth:
              <input type="date" value={dateOfBirth} onChange={handleDateOfBirthChange} />
            </label>
            </div>
          <div className='line_1'>
          <label>
              Street:
              <input type="text" value={street} onChange={handleStreetChange} />
            </label>
            <label>
              City:
              <input type="text" value={city} onChange={handleCityChange} />
            </label>
            <label>
              State:
              <input type="text" value={state} onChange={handleStateChange} />
            </label>
            <label>
              Zip:
              <input type="number" value={zip} min="0" max="99999" placeholder='xxxxx' onInput={(e) => limitInputLength(e.target, 5)} onChange={handleZipChange} />
            </label>
          </div>
       <div>
       <label>
              Job:
              <input type="text" value={job} onChange={handleJobChange} />
            </label>
       </div>
            <button onClick={toggleSecondPopup} >ENTER CARD INFORMATIONS</button>
        
          </div>
        </div>
      )}
       {isSecondPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>CREDIT CARD INFORMATIONS</h2>
        <div className='line_1'>
       
            <label>
              Credit Card Number:
              <input type="number" value={creditCardNumber}   placeholder='XXXX-XXXX-XXXX-XXXX' onInput={(e) => limitInputLength(e.target, 16)}  onChange={handleCreditCardNumberChange} />
            </label>
            <label>
              Expiration:
              <input type="Date" value={Expiration} onChange={handleExpiration} />
            </label>
            <label>
              CVC:
              <input type="number" value={CVC} onChange={handleCvc} min={1} max={9999}  onInput={(e) => limitInputLength(e.target, 4)} />
            </label>
        </div>
        
        <button onClick={toggleThirdPopup}>ENTER PRODUCT INFORMATIONS</button>
          </div>
        </div>
      )}
           {isThirdPopupVisible && (
      <div className='popup'>
          <div className='popup-content'>
          <h2>PRODUCT INFORMATIONS</h2>
             <div className='line_1'>
             <label>
                Merchant Country:
                 <select value={selectedCoordinates ? selectedCoordinates.key : ''} onChange={handleMerchantChange}>
                    <option value="" disabled>Select a country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country.key}>
                        {country.key}
                      </option>
                    ))}
                  </select>
              </label>
            <label>
              Category:
              <input type="text" value={category} onChange={handleCategoryChange} />
            </label>
            <label>
              Amount:
              <input type="number" value={amount} min={0} onChange={handleAmountChange} />
            </label>
           </div>
            <button onClick={toggleForthPopup}>PAY NOW</button>
                </div>
      </div>
            )}

      {isForthPopupVisible && (
       <div className={`popupp ${isPaymentSuccessful ? 'success' : 'failure'}`} style={{ backgroundColor: isPaymentSuccessful ? '#EEFAF4' : '#FFCCCC' }}>
         
            {isPaymentSuccessful ? (    
               <div className="popup-content"  >
                <img src={myimage}></img>
                <p>Payment Successful!</p>
        <h1>Your order has been confirmed</h1>
        <h3>Thank you for choosing our service. We're preparing your items for shipment, and you'll receive a confirmation email shortly.</h3>
                </div>
            )  : (
                <div className='popup-content'  >
                     <img src={myimage2} ></img>
                     <p>Payment Failed</p>
        <h1>Oops! Something went wrong with your payment.</h1>
        <h3>Contact your bank for more information or try again with a different payment method.</h3>
                </div>
            )}
          
          
        </div>
      )}
    </div>
  );
}

export default App;
