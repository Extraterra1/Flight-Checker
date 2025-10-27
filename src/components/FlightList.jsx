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

const Status = styled.span`
  color: ${({ $status }) => {
    switch ($status) {
      case 'Scheduled':
        return 'var(--warning)'; // Blue
      case 'Departed':
        return 'var(--primary)'; // Orange
      case 'Landed':
        return 'var(--success)'; // Green
      default:
        return 'var(--gray)'; // Gray (fallback)
    }
  }};
  font-weight: 700;
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

  & > div {
    > span.flight {
      font-weight: 800;
    }
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
      color: var(--primary);
    }
    & > :nth-child(2):hover {
      color: var(--warning);
    }
    & > :nth-child(3):hover {
      color: var(--danger);
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
            <FlightItem key={flight.id}>
              <div>
                <span className="flight">Flight:</span> {flight.icao + flight.number}
              </div>
              <div>
                <Status $status={flight.status}>{flight.status}</Status>
                <span className="time">{`${flight.status != 'Arrived' ? 'Lands at ' : 'Landed at '} ${flight.arriving}`}</span>

                <div className="icons">
                  <Icon icon="material-symbols:refresh-rounded" width="24" height="24" />
                  <Icon icon="material-symbols:edit-rounded" width="24" height="24" />
                  <Icon icon="material-symbols:delete-forever-rounded" width="24" height="24" />
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
