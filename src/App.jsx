import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import FlightInput from './components/FlightInput';
import styled from 'styled-components';
import { useState } from 'react';
import './index.css';
import FlightList from './components/FlightList';

const Main = styled.main`
  background-color: var(--light);
  display: grid;
  grid-template-rows: auto 1fr;
`;

function App() {
  const [flights, setFlights] = useState([]);
  return (
    <>
      <Header />
      <Main>
        <FlightInput flights={flights} setFlights={setFlights} />
        <FlightList flights={flights} />
      </Main>
      <Toaster toastOptions={{ className: 'toast' }} />
    </>
  );
}

export default App;
