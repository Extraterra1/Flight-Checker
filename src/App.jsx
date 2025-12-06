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
  const [loading, setLoading] = useState(true);

  // Realtime subscription to flights collection
  useEffect(() => {
    // Query with orderBy to keep a stable ordering on server-side (we still sort by arriving client-side)
    const q = query(collection(db, 'flights'), orderBy('date', 'desc'));

    const parseArriving = (val) => {
      // Firestore Timestamp
      if (val && typeof val.toDate === 'function') return val.toDate().getTime();
      if (!val) return Number.POSITIVE_INFINITY;
      if (typeof val === 'number') return val;
      if (val instanceof Date) return val.getTime();
      if (typeof val === 'string') {
        // Try ISO parse
        const iso = Date.parse(val);
        if (!isNaN(iso)) return iso;
        // Try HH:MM (assume today)
        const hm = val.match(/^(\d{1,2}):(\d{2})$/);
        if (hm) {
          const now = new Date();
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hm[1], 10), parseInt(hm[2], 10));
          return d.getTime();
        }
        // Try numeric
        const num = Number(val);
        if (!isNaN(num)) return num;
      }
      return Number.POSITIVE_INFINITY;
    };

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort by order field if it exists, otherwise by arriving time (earliest first)
        list.sort((a, b) => {
          // If both have order field, use that
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          // If only one has order, prioritize it
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          // Otherwise sort by arriving time
          return parseArriving(a.arriving) - parseArriving(b.arriving);
        });
        setFlights(list);
        setLoading(false);
      },
      (error) => {
        console.error('Realtime flights subscription error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  return (
    <>
      <Header />
      <Main>
        <FlightInput flights={flights} setFlights={setFlights} />
        <FlightList flights={flights} setFlights={setFlights} loading={loading} />
      </Main>
      <Toaster toastOptions={{ className: 'toast' }} />
    </>
  );
}

export default App;
