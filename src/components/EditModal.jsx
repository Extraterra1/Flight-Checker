import React, { useState, useEffect, useMemo } from 'react';
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
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 3rem;
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

/* react-select provides its own styles; we removed the native styled select */

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
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
`;

const EditModal = ({ isOpen, flight, cars = [], onConfirm, onCancel }) => {
  // react-select uses an object option { value, label }
  const [selectedOption, setSelectedOption] = useState(null);

  // Memoize options so their identity is stable across renders — prevents effect from resetting selection
  const options = useMemo(() => cars.map((c) => ({ value: c.plate, label: `${c.plate} — ${c.model}` })), [cars]);

  useEffect(() => {
    if (!isOpen) return;
    const initialPlate = flight && flight.car ? flight.car.plate : (cars[0] && cars[0].plate) || null;
    const initial = options.find((o) => o.value === initialPlate) || options[0] || null;
    setSelectedOption(initial);
  }, [isOpen, flight, options, cars]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedCar = cars.find((c) => c.plate === (selectedOption && selectedOption.value)) || null;
    onConfirm(selectedCar);
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
    singleValue: (base) => ({ ...base, color: 'var(--dark)' }),
    placeholder: (base) => ({ ...base, color: 'var(--dark)', opacity: 0.8 }),
    input: (base) => ({ ...base, color: 'var(--dark)' }),
    option: (base, state) => ({
      ...base,
      color: state.isSelected ? 'white' : 'var(--dark) ',
      backgroundColor: state.isSelected ? 'var(--main)' : base.backgroundColor
    })
  };

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true">
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>Edit Assigned Car</Title>

        <Field>
          <label htmlFor="car-select">Choose a car</label>
          <Select
            inputId="car-select"
            options={options}
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
            Save
          </Button>
        </Buttons>
      </Dialog>
    </Overlay>
  );
};

export default EditModal;
