import Header from './components/Header';
import FlightInput from './components/FlightInput';
import styled from 'styled-components';
import './index.css';
import FlightList from './components/FlightList';

const Main = styled.main`
  background-color: var(--light);
  display: grid;
  grid-template-rows: auto 1fr;
`;

function App() {
  return (
    <>
      <Header />
      <Main>
        <FlightInput />
        <FlightList flights={[]} />
      </Main>
    </>
  );
}

export default App;
