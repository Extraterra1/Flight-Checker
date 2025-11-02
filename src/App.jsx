import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import './index.css';

import FlightList from './components/FlightList';
import Header from './components/Header';
import FlightInput from './components/FlightInput';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const Main = styled.main`
  background-color: var(--light);
  display: grid;
  grid-template-rows: auto 1fr;
`;

function App() {
  const [flights, setFlights] = useState([]);
  // Realtime subscription to flights collection
  useEffect(() => {
    // Query with orderBy to keep a stable ordering (adjust field as needed)
    const q = query(collection(db, 'flights'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFlights(list);
      },
      (error) => {
        console.error('Realtime flights subscription error:', error);
      }
    );

    return () => unsubscribe();
  }, []);
  return (
    <>
      <Header />
      <Main>
        <FlightInput flights={flights} setFlights={setFlights} />
        <FlightList flights={flights} setFlights={setFlights} />
      </Main>
      <Toaster toastOptions={{ className: 'toast' }} />
    </>
  );
}

export default App;
