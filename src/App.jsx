import Header from './components/Header';
import FlightInput from './components/FlightInput';
import styled from 'styled-components';
import './index.css';

const Main = styled.main`
  background-color: var(--light);
`;

function App() {
  return (
    <>
      <Header />
      <Main>
        <FlightInput />
      </Main>
    </>
  );
}

export default App;
