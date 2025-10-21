import styled from 'styled-components';

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

  &:hover {
    background-color: var(--main-hover);
  }
`;

const FlightInput = () => {
  return (
    <Container>
      <Input type="text" placeholder="Enter flight number" />
      <Button>Add to List</Button>
    </Container>
  );
};

export default FlightInput;
