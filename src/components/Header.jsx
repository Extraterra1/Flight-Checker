import styled from 'styled-components';
import JDLogo from '../assets/JDLogo.png';
import gladplane from '../assets/gladplane.png';

const HeaderContainer = styled.nav`
  width: 100%;
  height: 6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main);
  padding: 0 2rem;
  gap: 1rem;

  @media (max-width: 700px) {
    height: auto;
    padding: 0.5rem 1rem;
    flex-direction: column;
    align-items: center;
    row-gap: 0.5rem;
  }
`;

const Title = styled.h1`
  color: var(--light);
  font-size: 2.2rem;

  @media (max-width: 700px) {
    font-size: 1.6rem;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.5rem;

  img {
    height: 100%;
    width: auto;
    max-height: 6rem;
    object-fit: contain;
  }
  @media (max-width: 700px) {
    display: none;

    img {
      max-height: 3.5rem;
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Flight Checker</Title>
      <ImageContainer>
        <img src={JDLogo} alt="Just Drive Madeira Logo" />
      </ImageContainer>
      <ImageContainer className="gladplane">
        <img src={gladplane} alt="Gladplane" />
      </ImageContainer>
    </HeaderContainer>
  );
};

export default Header;
