import { useEffect, useState } from "react"
import styled from "styled-components"
import IconeDeHospede from "./Icone";
import IconeDeHospedeVago from "./Icone";
import IconePreenchido from "./IconePreenchido";
import IconeUsuario from "./IconeOutroHospede";


export default function QuartoComponent({ id, reservasNoQuarto, num, cap, escolherQuarto, cor , escolhidoPeloUsuario }) {






  const [capacidade, setCapacidade] = useState([])
  const [quartoSelecionado, setQuartoSelecionado] = useState(cor)
  const [nesteQuarto, setNesteQuarto]=useState(reservasNoQuarto)
 

  const imagensDeCapacidade = [];
  const reservadosAqui = []





  const [ocupação, setOcupação] = useState(cap)


  useEffect(() => {
  
console.log(escolhidoPeloUsuario)

  for (let i = 0; i < reservasNoQuarto; i++) {
    reservadosAqui.push(1);
  }




    for (let i = 0; i < cap; i++) {
      imagensDeCapacidade.push(1);
    }

    setOcupação(imagensDeCapacidade)

  }, [])



  function escolherEsteQuarto(id) {
    if (escolhidoPeloUsuario){
      alert("Você já está nesse quarto, escolha outro ou prossiga para as atividades")
     return
    }
    escolherQuarto(id)
    console.log(nesteQuarto)
  }

if (reservasNoQuarto === 0 || !reservasNoQuarto) {
  return (
    <QuartoCard key={id} onClick={() => escolherEsteQuarto(id)} cor={cor}>
      <Numero>
        <p>{num}</p>
      </Numero>

      {cor ? (
        <Capacidade>
          <IconeUsuario i={0} />

          {Array(cap - 1).fill().map((_, index) => (<IconeDeHospedeVago key={index}/>))}
        </Capacidade>
        ) : (
        <Capacidade>
          {Array(cap).fill().map((_, index) => (<IconeDeHospedeVago key={index}/>))}
        </Capacidade>
      )}




    </QuartoCard>
  )
} else if (reservasNoQuarto >= 1 && reservasNoQuarto < cap){
  return (
    <QuartoCard key={id} onClick={() => escolherEsteQuarto(id)} cor={cor}>
      <Numero>
        <p>{num}</p>
      </Numero>

      {cor ? (
        <Capacidade>
          <IconeUsuario i={0} />

          {Array(cap - 2).fill().map((_, index) => (<IconeDeHospede key={index}/>))}
          {Array(reservasNoQuarto).fill().map((_, index) => (<IconePreenchido key={index}/>))}
        </Capacidade>
        ) : (
        <Capacidade>
          {Array(cap-1).fill().map((_, index) => (<IconeDeHospedeVago key={index}/>))}
          {Array(reservasNoQuarto).fill().map((_, index) => (<IconePreenchido key={index}/>))}
        </Capacidade>
      )}




    </QuartoCard>
  )
} else if(reservasNoQuarto === cap){
  return (
    <QuartoCard key={id} cor={false} full={true}>
      <Numero full={true}>
        <p>{num}</p>
      </Numero>

     
        <Capacidade>
        {Array(cap-1).fill().map((_, index) => (<IconeDeHospedeVago key={index}/>))}
          {Array(reservasNoQuarto).fill().map((_, index) => (<IconePreenchido key={index}/>))}
        </Capacidade>
     




    </QuartoCard>
  )
}


}

const QuartoCard = styled.div`
 background-color: ${props => {if (props.cor) {
  return "#FFEED2"
 } else if (props.full === true){
  return "#CECECE"
 } else if (props.cor === false){
  return "white"
 }}};
  width: 190px;
  height: 45px;
  display: flex;
  border: 1px solid #CECECE;
  border-radius: 10px;
  margin-right: 10px;
  margin-top: 5px;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  &:hover {
    outline: ${props => props.full ? "none" : "3px solid blue"} ;
  }

`

const Capacidade = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
align-items: center;
justify-content: flex-end;
  margin-right: 5px;
  img{
    height: 60%;
  }
`
const Numero = styled.div`
  width: 50%;
height: 100%;
display: flex;
align-items: center;
margin-left: 5px;
color:  ${props => props.full ? "grey" : "black"} ;
`
