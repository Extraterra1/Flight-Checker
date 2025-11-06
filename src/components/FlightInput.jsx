import styled from 'styled-components';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

// import cars from '/src/cars.json';
import { db } from '../firebase';

const Container = styled.div`
  padding: 3rem;
  display: flex;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 700px) {
    padding: 1.2rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Input = styled.input`
  padding: 2rem;
  border-radius: 1rem;
  border: 2px solid #c7c7c7;
  outline: none;
  transition: border-color 0.3s ease;
  font-size: 1.6rem;

  @media (max-width: 700px) {
    padding: 1.1rem;
    font-size: 1.4rem;
    width: 100%;
  }

  &:focus {
    border: 2px solid var(--main-light);
    outline: none; // This removes the default browser focus outline
  }
`;

const Button = styled.button`
  border-radius: 1rem;
  padding: 1rem 2rem;
  background-color: var(--main);
  color: var(--light);
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;

  &:focus,
  &:active {
    outline: none;
  }

  &:hover {
    background-color: var(--main-hover);
  }
  @media (max-width: 700px) {
    font-size: 1.4rem;
    padding: 0.9rem 1rem;
    width: 100%;
  }
`;

const FlightInput = ({ flights, setFlights }) => {
  const [flightNumber, setFlightNumber] = useState('');

  const handleAddFlight = async () => {
    const flightNumberPattern = /^(?:[A-Z0-9]{1,3})\d{2,5}$/;
    if (flightNumber.trim() !== '' && flightNumberPattern.test(flightNumber)) {
      let icao = flightNumber.slice(0, 2);
      if (icao === 'W4') icao = 'WMT';
      if (icao === 'DI') icao = 'MBU';
      if (icao === '4Y') icao = '4Y*';
      const number = flightNumber.slice(2);

      // Create the promise for fetching flight data
      const fetchFlightData = axios.get(`${import.meta.env.VITE_API_URL}?icao=${icao}&number=${number}`);

      try {
        // Use toast.promise to show loading, success, and error states
        const response = await toast.promise(fetchFlightData, {
          loading: 'Fetching flight information...'
          // success: 'Flight data retrieved!'
        });

        // Use the API response data
        const flightData = response.data;

        const newFlight = {
          arriving: flightData.time || 'N/A', // Use API data if available
          car: '',
          clientName: '',
          date: serverTimestamp(),
          icao: icao,
          number: number,
          status: flightData.status || 'N/A' // Use API data if available
        };

        const docRef = await addDoc(collection(db, 'flights'), newFlight);
        setFlights([...flights, { id: docRef.id, ...newFlight }]);
        setFlightNumber('');
        toast.success('Flight added to the list!');
      } catch (err) {
        if (err.status === 404) return toast.error('Flight not found. Please check the flight number and try again.');
        toast.error('Something went wrong');
        console.error('Error adding document: ', err);
      }
    } else {
      toast.error('Please enter a valid flight number.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddFlight();
    }
  };

  const handleInputChange = (e) => {
    // Convert to uppercase and remove any non-alphanumeric characters
    const input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    setFlightNumber(input);
  };

  return (
    <Container>
      <Input type="text" placeholder="Enter flight number" onChange={handleInputChange} value={flightNumber} onKeyDown={handleKeyDown} />
      <Button onClick={handleAddFlight}>Add to List</Button>
    </Container>
  );
};

export default FlightInput;
