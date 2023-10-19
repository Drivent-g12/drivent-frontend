import { useEffect, useState } from "react";
import { HoteisTitulo, ReservarQuartoButton } from "../../../pages/Dashboard/Hotel";
import { Detalhes, DetalhesDiv, HotelCard, ImagemDiv } from "../HotelComponent";
import axios from "axios";

export default function DetalhesDaEscolha({ hotelId, quartoId, reservar }) {

    const url = "http://localhost:4000"
const [hotelDetalhes, setHotelDetalhes]=useState([])
const [quartoDetalhes, setQuartoDetalhes]=useState([])

    useEffect(() => {
        const config = { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5NzczMjczN30.tM4r5bGAbFE3s88MepxvJqApZ5dmL3pokH00G-N39wM` } }
        const quartosDesteHotel = axios.get(`${url}/hotels/${hotelId}`, config)
            .then((res) => {
                setHotelDetalhes(res.data)
                const quartoEscolhido = (res.data.Rooms).find(obj => obj.id === quartoId)
                setQuartoDetalhes(quartoEscolhido)
                
            })
    })


    function mostrai(){
        console.log(quartoDetalhes)
        
    }
    return (
        <>
            <HoteisTitulo>
                <h2>Você já escolheu o seu quarto:</h2>
            </HoteisTitulo>

            <HotelCard>
                <ImagemDiv>
                    <img src={hotelDetalhes.image?hotelDetalhes.image:""} alt="Imagem do hotel" />
                </ImagemDiv>
                <DetalhesDiv>
                    <Detalhes>
                        <h1>{hotelDetalhes.name}</h1>
                    </Detalhes>

                    <Detalhes onClick={mostrai}>
                        <h2>Quarto reservado:</h2>
                        <p>{quartoDetalhes.name}</p>
                    </Detalhes>

                    <Detalhes>
                        <h2>Pessoas no seu quarto</h2>
                        <p>Apenas Você</p>
                    </Detalhes>
                </DetalhesDiv>
            </HotelCard>
            <ReservarQuartoButton onClick={reservar}>TROCAR DE QUATRO</ReservarQuartoButton>
        </>
    )
}