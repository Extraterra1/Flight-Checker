import styled from 'styled-components';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import cars from '/src/cars.json';

import { db } from '../firebase';

const Container = styled.div`
  padding: 3rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const Input = styled.input`
  padding: 2rem;
  border-radius: 1rem;
  border: 2px solid #c7c7c7;
  outline: none;
  transition: border-color 0.3s ease;
  font-size: 1.6rem;

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
`;

const FlightInput = ({ flights, setFlights }) => {
  const [flightNumber, setFlightNumber] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      const querySnapshot = await getDocs(collection(db, 'flights'));
      const flightsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setFlights(flightsData);
    };

    fetchFlights();
  }, []);

  const handleAddFlight = async () => {
    const flightNumberPattern = /^[A-Z]{1,3}\d{2,5}$/;
    if (flightNumber.trim() !== '' && flightNumberPattern.test(flightNumber)) {
      try {
        const newFlight = {
          arriving: '11:30',
          car: cars[Math.floor(Math.random() * cars.length)],
          clientName: 'John Doe',
          date: serverTimestamp(),
          icao: flightNumber.slice(0, 2).toUpperCase(),
          number: flightNumber.slice(2),
          status: 'Arrived'
        };
        const docRef = await addDoc(collection(db, 'flights'), newFlight);
        setFlights([...flights, { id: docRef.id, ...newFlight }]);
        setFlightNumber('');
        toast.success('Flight added to the list!');
      } catch (err) {
        toast.error('Error adding flight. Please try again.');
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
