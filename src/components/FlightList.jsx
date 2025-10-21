import styled from 'styled-components';
import { Icon } from '@iconify/react';

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

const FlightsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
`;

const FlightItem = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 2rem 3rem;
  border-radius: 1rem;
  border: 2px solid var(--main);
  font-size: 3rem;
  background-color: var(--main-light);
  color: var(--light);

  & > div:first-child > span {
    font-weight: 800;
  }

  & > div:last-child {
    display: flex;
    gap: 2rem;
  }

  & div.icons {
    display: flex;
    gap: 1rem;
    align-items: center;

    & > * {
      cursor: pointer;
      transition: color 0.3s ease;
    }

    & > :first-child:hover {
      color: var(--danger);
    }
    & > :nth-child(2):hover {
      color: var(--primary);
    }
  }
`;

const FlightList = ({ flights }) => {
  return (
    <Container>
      {flights.length === 0 ? (
        <EmptyMessage>No flights added yet.</EmptyMessage>
      ) : (
        <FlightsContainer>
          {flights.map((flight) => (
            <FlightItem key={flight}>
              <div>
                <span>Flight Number:</span> {flight.toUpperCase()}
              </div>
              <div>
                <span>Landed at 16:03</span>
                <div className="icons">
                  <Icon icon="material-symbols:delete-forever-rounded" width="24" height="24" />
                  <Icon icon="material-symbols:refresh-rounded" width="24" height="24" />
                </div>
              </div>
            </FlightItem>
          ))}
        </FlightsContainer>
      )}
    </Container>
  );
};

export default FlightList;
