import React from 'react';
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
  background: var(--light);
  color: var(--dark);
  padding: 2rem;
  border-radius: 0.75rem;
  min-width: 320px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  @media (max-width: 700px) {
    padding: 1rem;
  }
`;

const Message = styled.p`
  font-size: 1.6rem;
  margin: 0 0 1.25rem 0;
  @media (max-width: 700px) {
    font-size: 1.2rem;
  }
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
  border: 2px solid transparent;

  &.cancel {
    background: var(--primary);
    color: var(--light);
    border-color: rgba(255, 255, 255, 0.08);
  }

  &.confirm {
    background: var(--danger);
    color: white;
  }
  @media (max-width: 700px) {
    padding: 0.45rem 0.8rem;
    font-size: 1.1rem;
  }
`;

const DeleteModal = ({ isOpen, message = 'Are you sure you want to delete this flight?', onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true">
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Message>{message}</Message>
        <Buttons>
          <Button className="cancel" onClick={onCancel} aria-label="Cancel delete">
            Cancel
          </Button>
          <Button className="confirm" onClick={onConfirm} aria-label="Confirm delete">
            Delete
          </Button>
        </Buttons>
      </Dialog>
    </Overlay>
  );
};

export default DeleteModal;
