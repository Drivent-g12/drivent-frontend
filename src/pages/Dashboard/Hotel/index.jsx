import styled from "styled-components";
import { FormWrapper } from "../../../components/PersonalInformationForm/FormWrapper";
import { useEffect, useState } from "react";
import axios from 'axios';
import HotelComponent from "../../../components/Dashboard/HotelComponent";
import QuartoComponent from "../../../components/Dashboard/QuartoComponent";
import DetalhesDaEscolha from "../../../components/Dashboard/EscolhidoComponent";


export default function Hotel() {
  const [hoteisArray, setHoteisArray] = useState([])


  const [detalhes, setDetalhes]=useState([])
  const [next, setNext]=useState(false)


  function reservar(){
  setNext(!next)
}

  const url = "http://localhost:4000"

  useEffect(() => {

    const config = { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NzczMjczN30.tM4r5bGAbFE3s88MepxvJqApZ5dmL3pokH00G-N39wM` } }
    const getHoteis = axios.get(`${url}/hotels`, config)
    getHoteis.then((res) => {
      console.log(res.data)
      setHoteisArray(res.data)
    })

    getHoteis.catch((err) => {
      console.log(err.response.data)
    })


  }, [])




  const [hotelEscolhido, setHotelEscolhido] = useState()
  const [quartoEscolhido, setQuartoEscolhido] = useState()
  const [mostraQuartos, setMostraQuartos] = useState(false)
  const [quartos, setQuartos] = useState([])


  function carregarQuartosDoHotel(id) {
    const config = { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NzczMjczN30.tM4r5bGAbFE3s88MepxvJqApZ5dmL3pokH00G-N39wM` } }
    const quartosDesteHotel = axios.get(`${url}/hotels/${id}`, config)
    quartosDesteHotel.then((res) => {
      console.log(res.data.Rooms)
      setQuartos(res.data.Rooms)
    })
    quartosDesteHotel.catch((err) => {
      console.log(err.response.data)
    })
  }


  function escolherHotel(id) {
    setHotelEscolhido(id)
    setMostraQuartos(true)
    carregarQuartosDoHotel(id)
    setQuartoEscolhido(null)
  }

  function escolherQuarto(id) {
    setQuartoEscolhido(id)
  }



  return (
    <>
   
      <AreaDoHotel>
        <h1>Escolha de hotel e quarto</h1>
      </AreaDoHotel>
      { next ? (
      <div>
        <HoteisTitulo>
          <h2>Primeiro, escolha seu hotel</h2>
        </HoteisTitulo>

        <DivDosHoteis>

          {hoteisArray.map((hotel) => (
            <HotelComponent
              id={hotel.id}
              name={hotel.name}
              image={hotel.image}
              escolherHotel={() => escolherHotel(hotel.id)}
              cor={hotelEscolhido == (hotel.id)}
            />
          ))}

        </DivDosHoteis>


        <EscolhaQuarto display={mostraQuartos}>
          <QuartosTitulo>
            <h1>Ótima pedida! Agora escolha seu quarto</h1>
          </QuartosTitulo>

          <DivDosQuartos>
            {quartos.map((quarto) => (
              <QuartoComponent 
                key={quarto.id}
                num={quarto.name}
                cap={quarto.capacity} 
                escolherQuarto={()=> escolherQuarto(quarto.id)}
                cor={quartoEscolhido == (quarto.id)}/>
            ))}


          </DivDosQuartos>

          <ReservarQuartoButton onClick={reservar}>RESERVAR QUARTO</ReservarQuartoButton>
        </EscolhaQuarto>
      </div>
      ) : 
      (
      <DetalhesDaEscolha 
      hotelId={hotelEscolhido}
      quartoId={quartoEscolhido}
      reservar={reservar}
      />
      )}

      
    </>
  );
}

export const AreaDoHotel = styled.div`

 height: 10%;
 h1{
   font-size: 34px;
   font-weight: 400;
  }
`

export const HoteisTitulo = styled.div`
 height: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  h2{
    color: #8E8E8E;
    size: 20px;
    font-weight: 400;
  }
`

export const DivDosHoteis = styled.div`
  display: flex;
  align-items: flex-start;

`

const EscolhaQuarto = styled.div`
  margin-top: 25px;
display: ${props => props.display ? "flex" : "none"};
flex-direction: column;
`

const QuartosTitulo = styled.div`
 height: 35px;
  h1{
    color: #8E8E8E;
  }
`

const DivDosQuartos = styled.div`

  width: 100%;
  display: flex;
  flex-wrap: wrap;

`


export const ReservarQuartoButton = styled.button`
  margin-top: 5%;
  width: 182px;
  height: 37px;
  border-radius: 4px;
  border: 0px;
`