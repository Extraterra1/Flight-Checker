import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
`;

const EmptyMessage = styled.h4`
  color: var(--dark);
  font-size: 3rem;
  align-self: center;
`;

const FlightList = ({ flights }) => {
  return (
    <Container>
      {flights.length === 0 ? (
        <EmptyMessage>No flights added yet.</EmptyMessage>
      ) : (
        flights.map((flight, index) => (
          <div key={index}>
            <p>{flight}</p>
          </div>
        ))
      )}
    </Container>
  );
};

export default FlightList;
