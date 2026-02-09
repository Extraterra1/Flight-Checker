import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Dialog = styled.div`
  background: var(--main-light);
  color: var(--light);
  padding: 2rem;
  border-radius: 0.75rem;
  min-width: 320px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media (max-width: 700px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 3rem;
  @media (max-width: 700px) {
    font-size: 1.6rem;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  & label {
    font-size: 1.4rem;
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid #c7c7c7;
  outline: none;
  font-size: 1.6rem;
  @media (max-width: 700px) {
    font-size: 1.4rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  @media (max-width: 700px) {
    gap: 0.75rem;
  }
`;

const Button = styled.button`
  padding: 0.6rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  cursor: pointer;

  background-color: ${(props) => (props.$cancel ? 'var(--danger)' : 'var(--success)')};
  transition: background-color 0.3s ease-in;

  &:hover {
    background-color: ${(props) => (props.$cancel ? 'var(--danger-hover)' : 'var(--success-hover)')};
  }
  @media (max-width: 700px) {
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
  }
`;

const ManualAddModal = ({ isOpen, cars = [], carOptions = [], initialFlightNumber = '', onConfirm, onCancel }) => {
  const [manualFlightNumber, setManualFlightNumber] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setManualFlightNumber(initialFlightNumber || '');
    setArrivalTime('');
    setSelectedOption(null);
  }, [isOpen, initialFlightNumber]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedCar = cars.find((c) => c.plate === (selectedOption && selectedOption.value)) || null;
    onConfirm({ flightNumber: manualFlightNumber, arrivalTime, selectedCar });
  };

  // react-select custom styles: ensure text uses the app variable --dark and keep menu above modal
  const selectStyles = {
    menu: (base) => ({ ...base, zIndex: 2000 }),
    control: (base, state) => ({
      ...base,
      background: 'white',
      borderColor: state.isFocused ? 'var(--main)' : base.borderColor,
      boxShadow: state.isFocused ? `0 0 0 1px var(--main)` : base.boxShadow,
      color: 'var(--dark)'
    }),
    singleValue: (base) => ({ ...base, color: 'var(--dark)', fontSize: '16.5px' }),
    placeholder: (base) => ({ ...base, color: 'var(--dark)', opacity: 0.8, fontSize: '16.5px' }),
    input: (base) => ({ ...base, color: 'var(--dark)', fontSize: '16.5px' }),
    option: (base, state) => ({
      ...base,
      color: state.isSelected ? 'white' : 'var(--dark) ',
      backgroundColor: state.isSelected ? 'var(--main)' : base.backgroundColor,
      fontSize: '16.5px'
    })
  };

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true">
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>Add Flight Manually</Title>

        <Field>
          <label htmlFor="manual-flight-number">Flight Number *</label>
          <Input
            id="manual-flight-number"
            type="text"
            value={manualFlightNumber}
            onChange={(e) => setManualFlightNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            autoFocus
          />
        </Field>

        <Field>
          <label htmlFor="manual-arrival-time">Arrival Time *</label>
          <Input id="manual-arrival-time" type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
        </Field>

        <Field>
          <label htmlFor="manual-car-select">Choose a car (optional)</label>
          <Select
            inputId="manual-car-select"
            options={carOptions}
            value={selectedOption}
            onChange={setSelectedOption}
            isSearchable
            placeholder="Select a car..."
            styles={selectStyles}
          />
        </Field>

        <Buttons>
          <Button $cancel onClick={onCancel} aria-label="Cancel">
            Cancel
          </Button>
          <Button $save onClick={handleConfirm} aria-label="Save">
            Add
          </Button>
        </Buttons>
      </Dialog>
    </Overlay>
  );
};

export default ManualAddModal;
