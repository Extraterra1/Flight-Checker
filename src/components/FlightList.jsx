import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { db } from '../firebase';

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
      case 'Arrived':
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
  align-items: center;

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
    > span.number {
      font-weight: 800;
      min-width: 15rem;
    }
  }

  & div.info {
    display: flex;
    gap: 2rem;
    align-items: center;

    & .car {
      display: flex;
      flex-direction: column;
      font-size: 1.8rem;
      font-weight: 700;

      & > span {
        padding: 0.2rem 0;
      }

      & .model {
        border-top: 2px dashed var(--light);
      }
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

    & > .radar:hover {
      color: var(--dark);
    }
    & > .refresh:hover {
      color: var(--primary);
    }
    & > .edit:hover {
      color: var(--warning);
    }
    & > .delete:hover {
      color: var(--danger);
    }
  }
`;

const FlightList = ({ flights, setFlights }) => {
  const deleteFlight = (id) => async () => {
    try {
      // Delete from Firebase
      await deleteDoc(doc(db, 'flights', id));

      // Update local state
      setFlights(flights.filter((flight) => flight.id !== id));
      toast.success('Flight deleted successfully!');
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast.error('Failed to delete flight.');
    }
  };

  return (
    <Container>
      {flights.length === 0 ? (
        <EmptyMessage>No flights added yet.</EmptyMessage>
      ) : (
        <FlightsContainer>
          {flights.map((flight) => (
            <FlightItem key={flight.id}>
              <div className="info">
                <span className="flight">Flight:</span>
                <span className="number">{flight.icao + flight.number}</span>
                <div className="car">
                  <span className="plate">{flight.car && flight.car.plate}</span>
                  <span className="model">{flight.car && flight.car.model}</span>
                </div>
              </div>
              <div>
                <Status $status={flight.status}>{flight.status}</Status>
                <span className="time">{`${flight.status != 'Arrived' ? 'Lands at ' : 'Landed at '} ${flight.arriving}`}</span>

                <div className="icons">
                  <a
                    href={`https://www.flightradar24.com/${flight.icao}${flight.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on Flightradar"
                    className="radar"
                  >
                    <Icon icon="material-symbols:radar" width="24" height="24" />
                  </a>
                  <Icon className="refresh" icon="material-symbols:refresh-rounded" width="24" height="24" />
                  <Icon className="edit" icon="material-symbols:edit-rounded" width="24" height="24" />
                  <Icon onClick={deleteFlight(flight.id)} className="delete" icon="material-symbols:delete-forever-rounded" width="24" height="24" />
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
