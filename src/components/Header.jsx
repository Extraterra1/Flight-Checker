import styled from 'styled-components';

const HeaderContainer = styled.nav`
  width: 100%;
  height: 6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fe3a4d;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: #f9f6ee;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Flight Checker</Title>
      <Title>JustDrive</Title>
    </HeaderContainer>
  );
};

export default Header;
