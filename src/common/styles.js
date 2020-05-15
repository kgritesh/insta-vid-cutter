import styled from 'styled-components';

export const BorderedDiv = styled.div`
  display: flex;
  flexDirection: column;
  align-items: center;
  margin: 0 auto;
  padding: 25px;
  border: 2px dashed ${props => props.theme.colors.light}; 
  background-color: ${props => props.theme.colors.blueBackground};
  color: ${props => props.theme.colors.light};
  transition: "border .24s ease-in-out";  
`
