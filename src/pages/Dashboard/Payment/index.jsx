import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import styled from "styled-components";
import { getPersonalInformations } from "../../../services/enrollmentApi";

export default function Payment() {
  const {userData, setUserData} = useContext(UserContext)
  const [enrollment, setEnrollment] = useState()

  useEffect(()=>{
    console.log(userData.token)
    const getEnrollment = getPersonalInformations(userData.token)
    getEnrollment.then((res) =>{
      console.log(res)
      setEnrollment(res)
    })
    getEnrollment.catch((err)=>{
      console.log(err)
      setEnrollment(null)
    })
  },[])
  return(
    <>
      <SCPageHeader>Ingresso e pagamento</SCPageHeader>
      {!enrollment ? 
      <SCNotEnrolled>
        <SCNotEnrolledMsg>Você precisa completar sua inscrição antes de prosseguir pra escolha de ingresso</SCNotEnrolledMsg>
      </SCNotEnrolled> 
      : "OK"}
    </>
  )}

  const SCPageHeader = styled.div`
    font-family: "Roboto",sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 34px;
    line-height: 40px;
    color: #000000;
  `
  const SCNotEnrolled = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
  `

  const SCNotEnrolledMsg = styled.div`
    font-family: Roboto;
    font-size: 20px;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 388px;
    color:#8E8E8E;
    padding-bottom:50px;
  `