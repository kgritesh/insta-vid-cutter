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
`;

export const HorizontalDivider = styled.hr`
 background-color: #333;
`


export const GithubRibbon = styled.span`

 & a {
   background: #333;
   color: #fff;
   text-decoration: none;
   text-align: center;
   font-weight: bold;
   padding: 5px 40px;
   font-size: 1rem;
   line-height: 2rem;
   position: relative;
   transition: 0.5s;
 
  @media screen and (min-width: 800px) {   
    width: 200px;
    position: absolute;
    top: 60px;
    right: -60px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    box-shadow: 4px 4px 10px rgba(0,0,0,0.8);
  }
 }

 & a: hover {
   background: #c11;
   color: #fff;
 }

 & a:before, & a:after {
   content: "";
   width: 100%;
   display: block;
   position: absolute;
   top: 1px;left: 0;
   height: 1px;
   background: #fff;
 }

 & a:after {
   bottom: 1px; 
   top: auto;
 }  
 
 @media screen and (min-width: 800px) {   
   position: fixed;
   display: block;
   top: 0;
   right: 0;
   width: 200px;
   overflow: hidden;
   height: 200px;
   z-index: 9999;   
 }
 

`
