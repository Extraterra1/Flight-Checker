import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.6rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  background: white;
  color: black;
  font-size: 1.4rem;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  cursor: pointer;

  background-color: ${(props) => (props.$cancel ? 'var(--danger)' : 'var(--success)')};
  transition: background-color 0.3s ease-in;

  &:hover {
    background-color: ${(props) => (props.$cancel ? 'var(--danger-hover)' : 'var(--success-hover)')};
  }
`;

const EditModal = ({ isOpen, flight, cars = [], onConfirm, onCancel }) => {
  const [selectedPlate, setSelectedPlate] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelectedPlate(flight && flight.car ? flight.car.plate : (cars[0] && cars[0].plate) || '');
  }, [isOpen, flight, cars]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedCar = cars.find((c) => c.plate === selectedPlate) || null;
    onConfirm(selectedCar);
  };

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true">
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>Edit Assigned Car</Title>

        <Field>
          <label htmlFor="car-select">Choose a car</label>
          <Select id="car-select" value={selectedPlate} onChange={(e) => setSelectedPlate(e.target.value)}>
            {cars.map((car) => (
              <option key={car.plate} value={car.plate}>{`${car.plate} — ${car.model}`}</option>
            ))}
          </Select>
        </Field>

        <Buttons>
          <Button $cancel onClick={onCancel} aria-label="Cancel">
            Cancel
          </Button>
          <Button $save onClick={handleConfirm} aria-label="Save">
            Save
          </Button>
        </Buttons>
      </Dialog>
    </Overlay>
  );
};

export default EditModal;
