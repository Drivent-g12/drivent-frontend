import { useContext, useEffect, useState } from "react";
import { HoteisTitulo, ReservarQuartoButton } from "../../../pages/Dashboard/Hotel";
import { Detalhes, DetalhesDiv, HotelCard, ImagemDiv } from "../HotelComponent";
import axios from "axios";
import UserContext from "../../../contexts/UserContext";

export default function DetalhesDaEscolha({ quartoReservado, setNext , next}) {

    const url = "http://localhost:4000"
    const { userData, setUserData } = useContext(UserContext)
    const [hotelDetalhes, setHotelDetalhes] = useState([])
    const [outrosAqui, setOutrosAqui]=useState(0)



    useEffect(() => {
        
        console.log(quartoReservado)
        const config = { headers: { Authorization: `Bearer ${userData.token}` } }


        const usuarioJaReservou = axios.get(`${url}/booking`, config)
        usuarioJaReservou.then((res)=>{
            if (res.data.length === 0){
                setNext(true)
            }
          
            console.log(res.data)
        })




        const quartosDesteHotel = axios.get(`${url}/hotels/${quartoReservado.hotelId}`, config)
            .then((res) => {
                setHotelDetalhes(res.data)
            })



        
        const getBookingsDoHotel = axios.get(`${url}/booking/${quartoReservado.hotelId}`, config)
        getBookingsDoHotel.then((res) => {
        setOutrosAqui(res.data.filter((reserva) => reserva.roomId === quartoReservado.id).length)
        console.log(res.data.filter((reserva) => reserva.roomId === quartoReservado.id).length)
        }
            )





        }, [])




        function trocarDeQuarto() {
            setNext(true)
        }

    

        return (
            <>
                <HoteisTitulo>
                    <h2>Você já escolheu o seu quarto:</h2>
                </HoteisTitulo>

                <HotelCard>
                    <ImagemDiv>
                        <img src={hotelDetalhes.image ? hotelDetalhes.image : ""} alt="Imagem do hotel" />
                    </ImagemDiv>
                    <DetalhesDiv>
                        <Detalhes>
                            <h1>{hotelDetalhes?.name}</h1>
                        </Detalhes>

                        <Detalhes>
                            <h2>Quarto reservado:</h2>
                            <p>{quartoReservado?.name}</p>
                        </Detalhes>

                        <Detalhes>
                            <h2>Pessoas no seu quarto</h2>
                            <p>{outrosAqui >= 2 ? `Você e mais ${outrosAqui-1} pessoas` : "Apenas você"}</p>
                        </Detalhes>
                    </DetalhesDiv>
                </HotelCard>
                <ReservarQuartoButton onClick={trocarDeQuarto}>TROCAR DE QUATRO</ReservarQuartoButton>
            </>
        )
    }