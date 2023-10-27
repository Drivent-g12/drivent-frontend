import styled from "styled-components";
import { FormWrapper } from "../../../components/PersonalInformationForm/FormWrapper";
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import HotelComponent from "../../../components/Dashboard/HotelComponent";
import QuartoComponent from "../../../components/Dashboard/QuartoComponent";
import DetalhesDaEscolha from "../../../components/Dashboard/EscolhidoComponent";
import UserContext from "../../../contexts/UserContext";
import useTicket from "../../../hooks/api/useTicket";
import { useNavigate } from "react-router-dom";


export default function Hotel() {
  const [paginaAberta, setPaginaAberta] = useState(false)
  const [hoteisArray, setHoteisArray] = useState([])
  const { userData, setUserData } = useContext(UserContext)
  const { ticket } = useTicket()
  const [ticketStatus, setTicketStatus] = useState()//ticket.status
  const [ticketRemote, setTicketRemote] = useState()//ticket.TicketType.isRemote
  const [includesHotel, setIncludesHotel] = useState()//ticket.TicketType.includesHotel
  const [next, setNext] = useState(true)
  const [hotelEscolhido, setHotelEscolhido] = useState()
  const [quartoEscolhido, setQuartoEscolhido] = useState()
  const [mostraQuartos, setMostraQuartos] = useState(false)
  const [quartos, setQuartos] = useState([])
  const [reservasDoHotel, setReservasDoHotel]=useState()
  const [quartoReservado, setQuatoReservado] = useState()
  const [quartoId, setQuartoId]=useState()
  const navigate = useNavigate()


  const url = "http://localhost:4000"

  useEffect(() => {

    if (!userData.token) {
      navigate("/sign-in")
    }

    if (ticket) {
      console.log("ó o ticket")
      console.log(ticket)
      setTicketStatus(ticket.status)
      setTicketRemote(ticket.TicketType.isRemote)
      setIncludesHotel(ticket.TicketType.includesHotel)
    }
    setPaginaAberta(true)

    const config = { headers: { Authorization: `Bearer ${userData.token}` } }

    const getBooking = axios.get(`${url}/booking/`, config)
    getBooking.then((res) => {
      if (res.data.Room) {
        
        
        setQuatoReservado(res.data.Room)
        setNext(false)
        setQuartoId(res.data.Room.id)
      } else {
        setNext(true)
      }

    })
    getBooking.catch((err) => {
      console.log(err.response.data)
    })



    const getHoteis = axios.get(`${url}/hotels`, config)
    getHoteis.then((res) => {
      setHoteisArray(res.data)
    })

    getHoteis.catch((err) => {
      console.log(err.response.data)
    })

  }, [paginaAberta])





  function carregarQuartosDoHotel(id) {
    const config = { headers: { Authorization: `Bearer ${userData.token}` } }
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
    const config = { headers: { Authorization: `Bearer ${userData.token}` } }
    const getBookingsDoHotel = axios.get(`${url}/booking/${id}`, config)
    getBookingsDoHotel.then((res)=>{
      console.log(res.data)
      setReservasDoHotel(res.data)
    })
    getBookingsDoHotel.catch((err)=>{
      console.log(err.response.data)
    })


  }

  function escolherQuarto(id) {
    setQuartoEscolhido(id)
  }

  function reservar() {
    
    const config = { headers: { Authorization: `Bearer ${userData.token}` } }
    const body = { roomId: quartoEscolhido }
    if (quartoReservado && quartoReservado.id !== quartoEscolhido) {
      const trocarReserva = axios.put(`${url}/booking/${quartoReservado.id}`, body, config)
      trocarReserva.then((res) => {
        setPaginaAberta(false)
        console.log("Reserva de quarto trocada com sucesso!")
      })
      trocarReserva.catch((err) => {
        console.log(err.response.data)
      })
      setNext(!next)
    } else {
      const reservarEsteQuarto = axios.post(`${url}/booking/`, body, config)
      reservarEsteQuarto.then((res) => {
        setPaginaAberta(false)
        console.log("Quarto reservado com sucesso!")
        setNext(!next)
      })
      reservarEsteQuarto.catch((err) => {
        console.log(err.response.data)
      })
     
    }
  }


  if (ticketRemote === true || includesHotel === false) {
    return (
      <><h1>Sua modalidade de ingresso não inclui hospedagem
        Prossiga para a escolha de atividades</h1></>
    )
  }

  if ((!ticket) || (ticketRemote === false && ticketStatus === "RESERVED")) {
    return (
      <><h1>Você precisa ter confirmado pagamento antes
        de fazer a escolha de hospedagem</h1></>
    )
  }



  return (
    <>

      <AreaDoHotel>
        <h1>Escolha de hotel e quarto</h1>
      </AreaDoHotel>
      {next ? (
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
                  id={quarto.id}
                  reservasNoQuarto={reservasDoHotel?.filter((reserva) => reserva.roomId === quarto.id).length}
                  num={quarto.name}
                  cap={quarto.capacity}
                  escolherQuarto={() => escolherQuarto(quarto.id)}
                  cor={quartoEscolhido == (quarto.id)} 
                  escolhidoPeloUsuario={quartoId === quarto.id}/>
              ))}


            </DivDosQuartos>

            <ReservarQuartoButton onClick={reservar}>RESERVAR QUARTO</ReservarQuartoButton>
          </EscolhaQuarto>
        </div>
      ) :
        (
          <DetalhesDaEscolha
          hotelEscolhido={hoteisArray.filter((hotel)=> hotel.id === hotelEscolhido)}
            quartoReservado={quartoReservado}
            setNext={setNext}
            next={next}
            paginaAberta={paginaAberta}
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