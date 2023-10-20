import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import styled from "styled-components";
import { getPersonalInformations } from "../../../services/enrollmentApi";
import useEnrollment from "../../../hooks/api/useEnrollment";

export default function Payment() {
  const {userData, setUserData} = useContext(UserContext)
  const {enrollment} = useEnrollment() 
  const [ticketType, setTicketType] = useState(0)
  return(
    <>
      <SCPageHeader>Ingresso e pagamento</SCPageHeader>
      {!enrollment ? 
      <SCNotEnrolled>
        <SCNotEnrolledMsg>Você precisa completar sua inscrição antes de prosseguir pra escolha de ingresso</SCNotEnrolledMsg>
      </SCNotEnrolled> 
      :
      <>
      <SCTicketTypeHeader>
        Primeiro, escolha sua modalidade de ingresso
      </SCTicketTypeHeader>
      <SCButtonContainer>
        <SCOptionButton selected={ticketType > 1} onClick={()=>setTicketType(4)}>Presencial<SCPriceSpan>R$ 550</SCPriceSpan></SCOptionButton>
        <SCOptionButton selected={ticketType === 1} onClick={()=>setTicketType(1)}>Online<SCPriceSpan>R$ 500</SCPriceSpan></SCOptionButton>
      </SCButtonContainer>
      {ticketType > 1 ?
        <>
          <SCTicketTypeHeader>
            Ótimo! Agora escolha sua modalidade de hospedagem
          </SCTicketTypeHeader>
          <SCButtonContainer>
            <SCOptionButton selected={ticketType === 2} onClick={()=>setTicketType(2)}>Sem Hotel<SCPriceSpan>+ R$ 0</SCPriceSpan></SCOptionButton>
            <SCOptionButton selected={ticketType === 3} onClick={()=>setTicketType(3)}>Com Hotel<SCPriceSpan>+ R$ 100</SCPriceSpan></SCOptionButton>
          </SCButtonContainer>
        </> 
       : ""}
       
      </>
      }
    </>
  )}

  const SCPageHeader = styled.div`
    font-family: "Roboto",sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 34px;
    line-height: 40px;
    color: #000000;
    margin-bottom:37px;
  `
  const SCNotEnrolled = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
  `

  const SCNotEnrolledMsg = styled.div`
    font-family: "Roboto",sans-serif  ;
    font-size: 20px;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 388px;
    color:#8E8E8E;
    padding-bottom:50px;
  `
  const SCTicketTypeHeader = styled.div`
    color: #8E8E8E;
    font-family: "Roboto",sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal; 
    margin-bottom:17px;
  `
  const SCOptionButton = styled.button`
    border-radius: 20px;
    border: ${(props) =>(props.selected ? "none":"1px solid #CECECE")}; 
    width: 145px;
    height: 145px; 
    background-color: ${(props) =>(props.selected ? "#FFEED2":"white")};
    display:flex;
    justify-content:center;
    align-items:center;
    color: #454545;
    text-align: center;
    font-family: "Roboto",sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal; 
    flex-direction:column;
  `
  const SCButtonContainer = styled.div`
    display:flex;
    gap:24px;
    justify-content:flex-start;
    align-items:flex-start;
    margin-bottom:44px;
  `
  const SCPriceSpan = styled.span`
    color: #898989;
    text-align: center;
    font-family: "Roboto",sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal; 
  `