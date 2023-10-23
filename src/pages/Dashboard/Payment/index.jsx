import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import styled from "styled-components";
import useEnrollment from "../../../hooks/api/useEnrollment";
import { createTicket } from "../../../services/ticketApi";
import useTicket from "../../../hooks/api/useTicket";
import creditCardChip from '../../../assets/images/creditcardchip.png';
import Input from "../../../components/Form/Input";
import { CircleCheckFill } from 'akar-icons';
import { processPayment } from "../../../services/paymentApi";

export default function Payment() {
  const { userData, setUserData } = useContext(UserContext)
  const { enrollment } = useEnrollment()
  const { ticket } = useTicket()
  const [ticketType, setTicketType] = useState(0)

  const [paymentOptionsVisibility, setPaymentOptionsVisibility] = useState(true);
  const [cardVisibility, setCardVisibility] = useState(false);
  const [confirmationVisibility, setConfirmationVisibility] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardValidThru, setCardValidThru] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [ticketId, setTicketId] = useState();

  const ticketTypeRelation = {
    1: 'Online',
    2: 'Presencial + Sem Hotel',
    3: 'Presencial + Com Hotel',
  };

  async function setTicketPaid() {
    setConfirmationVisibility(true);
    setCardVisibility(false);
    const paymentData = {
      ticketId: ticketId,
      cardData: {
        issuer: "card issuer",  // fix later
        number: cardNumber,
        name: cardName,
        expirationDate: cardValidThru,
        cvv: cardCvv,
      },
    };
    console.log(paymentData);
    const request = processPayment(paymentData, userData.token)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  async function reserveTicket() {
    setCardVisibility(true);
    setPaymentOptionsVisibility(false);
    const request = createTicket(ticketType, userData.token)
      .then((res) => {
        console.log(res);
        setTicketId(res.id);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  useEffect(() => {
    if (ticket) {
      setTicketType(ticket.ticketTypeId);
      setTicketId(ticket.id);
      if (ticket.status === 'RESERVED') {
        setCardVisibility(true);
        setPaymentOptionsVisibility(false);
      }
      else if (ticket.status === 'PAID') {
        setPaymentOptionsVisibility(false);
        setConfirmationVisibility(true);
        setCardVisibility(false);
      }
    };
  }, [ticket, ticketType, setTicketType]);
  return (
    <>
      <SCPageHeader>Ingresso e pagamento</SCPageHeader>
          {!enrollment ?
            <SCNotEnrolled>
              <SCNotEnrolledMsg>Você precisa completar sua inscrição antes de prosseguir pra escolha de ingresso</SCNotEnrolledMsg>
            </SCNotEnrolled>
            :
            <>
              <span style={{ display: paymentOptionsVisibility ? "block" : "none" }}>
                <SCTicketTypeHeader>
                  Primeiro, escolha sua modalidade de ingresso
                </SCTicketTypeHeader>
                <SCButtonContainer>
                  <SCOptionButton disabled={ticket} selected={ticketType > 1} onClick={() => setTicketType(4)}>Presencial<SCPriceSpan>R$ 550</SCPriceSpan></SCOptionButton>
                  <SCOptionButton disabled={ticket} selected={ticketType === 1} onClick={() => setTicketType(1)}>Online<SCPriceSpan>R$ 500</SCPriceSpan></SCOptionButton>
                </SCButtonContainer>
                {ticketType > 1 ?
                  <>
                    <SCTicketTypeHeader>
                      Ótimo! Agora escolha sua modalidade de hospedagem
                    </SCTicketTypeHeader>
                    <SCButtonContainer>
                      <SCOptionButton disabled={ticket} selected={ticketType === 2} onClick={() => setTicketType(2)}>Sem Hotel<SCPriceSpan>+ R$ 0</SCPriceSpan></SCOptionButton>
                      <SCOptionButton disabled={ticket} selected={ticketType === 3} onClick={() => setTicketType(3)}>Com Hotel<SCPriceSpan>+ R$ 100</SCPriceSpan></SCOptionButton>
                    </SCButtonContainer>
                  </>
                  : ""}
                {ticketType > 0 && ticketType < 4 ?
                  <>
                    <SCTicketTypeHeader>
                      Fechado! O total ficou em R$ {500 + (ticketType > 1) * 50 + (ticketType === 3) * 100}. Agora é só confirmar:
                    </SCTicketTypeHeader>
                    <SCReserveButton onClick={reserveTicket}>RESERVAR INGRESSO</SCReserveButton>
                  </>
                  : ""}
              </span>

              <span style={{ display: cardVisibility ? "block" : "none" }}>
                <SCTicketTypeHeader>Ingresso escolhido</SCTicketTypeHeader>
                <SCButtonContainer>
                  <SCSelectedType>{ticketTypeRelation[ticketType]}<SCPriceSpan>R$ {500 + (ticketType > 1) * 50 + (ticketType === 3) * 100}</SCPriceSpan></SCSelectedType>
                </SCButtonContainer>
                <SCTicketTypeHeader>Pagamento</SCTicketTypeHeader>
                <SCPaymentDiv>
                  <SCPaymentCard>
                    <img src={creditCardChip} style={{ width: "40px" }} />
                    <p style={{ marginTop: "25px", fontSize: "20px" }}>{cardNumber === '' ? '0000 0000 0000 0000' : cardNumber}</p>
                    <p style={{ marginTop: "25px", color: "lightgrey" }}>{cardName === '' ? 'Nome no Cartão' : cardName.substring(0, 25)}</p>
                    <p style={{ color: "lightgrey" }}>{cardValidThru === '' ? '00/00' : cardValidThru}</p>
                  </SCPaymentCard>
                  <div style={{ marginLeft: '20px' }}>
                    <InputWrapper>
                      <Input
                        style={{ width: '400px' }}
                        name="cardnumber"
                        label="Número do Cartão"
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(
                          e.target.value.substring(0, 19).replace(/[^0-9]/g, '').replace(/\d{4}(?=.)/g, '$& ')
                        )}
                      />
                    </InputWrapper>
                    <InputWrapper>
                      <Input
                        style={{ width: '400px' }}
                        name="name"
                        label="Nome"
                        type="text"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                      />
                    </InputWrapper>
                    <div style={{ display: 'flex' }}>
                      <InputWrapper>
                        <Input
                          style={{ width: '250px' }}
                          name="validthru"
                          label="Validade"
                          type="text"
                          value={cardValidThru}
                          onChange={e => setCardValidThru(
                            e.target.value.substring(0, 5).replace(/[^0-9]/g, '').replace(/\d{2}(?=.)/g, '$&/')
                          )}
                        />
                      </InputWrapper>
                      <InputWrapper>
                        <Input
                          style={{ width: '143px', marginLeft: '7px' }}
                          name="cvv"
                          label="CVV"
                          type="password"
                          maxLength="3"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value.substring(0, 3))}
                        />
                      </InputWrapper>
                    </div>
                  </div>
                </SCPaymentDiv>
                <SCReserveButton style={{ width: '182px', marginTop: '30px' }} onClick={setTicketPaid}>FINALIZAR PAGAMENTO</SCReserveButton>
              </span>

              <span style={{ display: confirmationVisibility ? "block" : "none" }}>
                <SCTicketTypeHeader>Ingresso escolhido</SCTicketTypeHeader>
                <SCButtonContainer>
                  <SCSelectedType>{ticketTypeRelation[ticketType]}<SCPriceSpan>R$ {500 + (ticketType > 1) * 50 + (ticketType === 3) * 100}</SCPriceSpan></SCSelectedType>
                </SCButtonContainer>
                <SCTicketTypeHeader>Pagamento</SCTicketTypeHeader>
                <div style={{ display: "flex" }}>
                  <CircleCheckFill color="#36B853" size={44} />
                  <div style={{ marginTop: "6px", marginLeft: "10px", fontFamily: "Roboto", color: "#454545" }}>
                    <p><strong>Pagamento confirmado!</strong></p>
                    <p>Prossiga para escolha de hospedagem e atividades</p>
                  </div>
                </div>
              </span>
        </>
      }
    </>
  )
}

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
    border: ${(props) => (props.selected ? "none" : "1px solid #CECECE")}; 
    width: 145px;
    height: 145px; 
    background-color: ${(props) => (props.selected ? "#FFEED2" : "white")};
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
    margin-bottom:35px;
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
const SCReserveButton = styled.button`
    width: 162px;
    height: 37px; 
    border-radius: 4px;
    background: #E0E0E0;
    border: none;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
  `
const SCSelectedType = styled.div`
  border-radius: 20px;
  width: 290px;
  height: 108px; 
  background-color: #FFEED2;
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
const SCPaymentCard = styled.div`
  padding-left: 30px;
  padding-top: 30px;
  border-radius: 20px;
  width: 320px;
  height: 200px; 
  background-color: #929292;
  display:flex;
  justify-content:left;
  color: white;
  font-family: "Roboto",sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal; 
  flex-direction:column;
  `
const SCPaymentDiv = styled.div`
  display: flex;
  `
export const InputWrapper = styled.div`
> div {
  width: 100%;
  }
  `