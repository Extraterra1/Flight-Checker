import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { MdArrowDropDown } from 'react-icons/md';

// import cars from '/src/cars.json';
import { db } from '../firebase';
import cars from '../cars.json';
import ManualAddModal from './ManualAddModal';

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
    padding: 1.5rem;
    font-size: 2rem;
    width: 100%;
  }

  &:focus {
    border: 2px solid var(--main-light);
    outline: none; // This removes the default browser focus outline
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  position: relative;
  align-items: stretch;
  @media (max-width: 700px) {
    width: 100%;
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
    font-size: 1.8rem;
    padding: 0.9rem 1rem;
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  flex: 1;
`;

const DropdownButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.2rem;
  @media (max-width: 700px) {
    width: auto;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  background: var(--main-light);
  border: 2px solid var(--main);
  border-radius: 0.8rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  z-index: 5;
  min-width: 16rem;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.9rem 1.2rem;
  background: transparent;
  border: none;
  color: var(--light);
  font-size: 1.4rem;
  cursor: pointer;

  &:hover {
    background: var(--main);
  }
`;

const FlightInput = ({ flights, setFlights }) => {
  const [flightNumber, setFlightNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const dropdownRef = useRef(null);

  const carOptions = useMemo(() => cars.map((c) => ({ value: c.plate, label: `${c.plate} — ${c.model}` })), []);

  const parseFlightNumber = (value) => {
    const flightNumberPattern = /^(?:[A-Z0-9]{1,3})\d{2,5}$/;
    if (value.trim() === '' || !flightNumberPattern.test(value)) return null;
    let icao = value.slice(0, 2);
    if (icao === 'W4') icao = 'WMT';
    if (icao === 'DI') icao = 'MBU';
    if (icao === '4Y') icao = '4Y*';
    if (icao === 'TB') icao = 'JAF';
    const number = value.slice(2);
    return { icao, number };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddFlight = async () => {
    const parsed = parseFlightNumber(flightNumber);
    if (parsed) {
      const { icao, number } = parsed;

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
          status: flightData.status || 'N/A', // Use API data if available
          order: flights.length // Add to the end of the list
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

  const handleManualAdd = async ({ flightNumber: manualNumber, arrivalTime, selectedCar }) => {
    const parsed = parseFlightNumber(manualNumber);
    if (!parsed) {
      toast.error('Please enter a valid flight number.');
      return;
    }
    if (!arrivalTime) {
      toast.error('Please select an arrival time.');
      return;
    }

    try {
      const newFlight = {
        arriving: arrivalTime,
        car: selectedCar || '',
        clientName: '',
        date: serverTimestamp(),
        icao: parsed.icao,
        number: parsed.number,
        status: 'Manual',
        order: flights.length
      };

      const docRef = await addDoc(collection(db, 'flights'), newFlight);
      setFlights([...flights, { id: docRef.id, ...newFlight }]);
      setIsManualOpen(false);
      setIsDropdownOpen(false);
      toast.success('Manual flight added to the list!');
    } catch (err) {
      toast.error('Something went wrong');
      console.error('Error adding manual flight: ', err);
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
      <ButtonGroup ref={dropdownRef}>
        <PrimaryButton onClick={handleAddFlight}>Add to List</PrimaryButton>
        <DropdownButton onClick={() => setIsDropdownOpen((prev) => !prev)} aria-label="Add options">
          <MdArrowDropDown size={22} />
        </DropdownButton>
        {isDropdownOpen && (
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                setIsManualOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              Add Manually
            </DropdownItem>
          </DropdownMenu>
        )}
      </ButtonGroup>
      <ManualAddModal
        isOpen={isManualOpen}
        cars={cars}
        carOptions={carOptions}
        initialFlightNumber={flightNumber}
        onConfirm={handleManualAdd}
        onCancel={() => setIsManualOpen(false)}
      />
    </Container>
  );
};

export default FlightInput;
