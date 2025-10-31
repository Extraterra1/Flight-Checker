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
`;

const Title = styled.h1`
  color: var(--light);
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.5rem;

  img {
    height: 100%;
    width: auto;
    max-height: 10rem;
    object-fit: contain;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Flight Checker</Title>
      <ImageContainer>
        <img src={JDLogo} alt="Just Drive Madeira Logo" />
      </ImageContainer>
      <ImageContainer>
        <img src={gladplane} alt="Just Drive Madeira Logo" />
      </ImageContainer>
    </HeaderContainer>
  );
};

export default Header;
