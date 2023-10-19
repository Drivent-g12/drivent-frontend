import axios from "axios"
import { useEffect, useState } from "react"
import styled from "styled-components"

export default function HotelComponent({ id, image, name, escolherHotel, cor }) {

  const [vagas, setVagas] = useState()
  const [acomodações, setAcomodações] = useState([])
  const url = "http://localhost:4000"

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NzczMjczN30.tM4r5bGAbFE3s88MepxvJqApZ5dmL3pokH00G-N39wM` } }
    const quartosDesteHotel = axios.get(`${url}/hotels/${id}`, config)
      .then((res) => {
        setVagas(res.data.Rooms.length)
        const hasCapacity1 = (res.data.Rooms).some(room => room.capacity === 1)
        const hasCapacity2 = (res.data.Rooms).some(room => room.capacity === 2)
        const hasCapacity3 = (res.data.Rooms).some(room => room.capacity === 3)
        if (hasCapacity1) {
          if (acomodações.includes("Single")) return
          setAcomodações([...acomodações, "Single"])
        }
        if (hasCapacity2) {
          if (acomodações.includes("Double")) return
          setAcomodações([...acomodações, "Double"])
        }
        if (hasCapacity3) {
          if (acomodações.includes("Triple")) return
          setAcomodações([...acomodações, "Triple"])
        }
      })
   

  })

 

  function escolherEsteHotel(id) {
    escolherHotel(id)
  }

  return (
    <HotelCard key={id} onClick={() => escolherEsteHotel(id)} cor={cor}>
      <ImagemDiv>
        <img src={image} alt="Imagem do hotel" />
      </ImagemDiv>
      <DetalhesDiv>
        <Detalhes>
          <h1>{name}</h1>
        </Detalhes>
        <Detalhes>
          <h2>Tipos de acomodação:</h2>
          <p>{acomodações.join(', ')}</p>
        </Detalhes>
        <Detalhes>
          <h2>Quartos disponíveis:</h2>
          <p>{vagas}</p>
        </Detalhes>
      </DetalhesDiv>
    </HotelCard>
  )
}

export const HotelCard = styled.div`
  min-width: 196px;
  max-width: 197px;
  height: 264px;
  margin-right: 20px;
  margin-top: 20px;
  background-color: ${props => props.cor ? "#FFEED2" : "#F1F1F1"};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
&:hover {
    outline: 3px solid blue;
  }
`


export const ImagemDiv = styled.div`
  width: 180px;
  height: 109px;
  margin-top: 15px;
  
  display: flex;
  background-color: aliceblue;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img{
    width: 100%;
    border-radius: 10px;
  }
`


export const DetalhesDiv = styled.div`
  display: flex;
  height: 55%;
  width: 85%;
  flex-direction: column;
  justify-content:space-evenly;
  h1{
    font-weight: 400;
    font-size: 20px;
  }
  h2{
    font-weight: 700;
    font-size: 12px;
  }
  p{
    font-weight: 400;
    font-size: 12px;
  }
`


export const Detalhes = styled.div`
  display: flex;
  flex-direction: column;
`