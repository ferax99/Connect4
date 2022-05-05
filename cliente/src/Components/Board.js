import React, { useState, useEffect } from 'react';
import '../style.css';

const dic = { 1: "rojo", 2: "amarillo" }
const clase = { 1: "roja", 2: "amarilla" }
var fin = 0;
const Board = (props) => {
  const [contador, setContador] = useState(0);
  const [player, setPlayer] = useState(props.player);
  const [tablero, setTablero] = useState(props.tablero);
  const [turn, setTurn] = useState(props.player);
  const [mensaje, setMensaje] = useState("");
  const [alertWon, setAlertWon] = useState(0);

  useEffect(() => {
    /*
    socket.on(('connect'), () => {
      console.log("conectado al socket en: "+socket.id)
      
    })
 
    socket.on("get-tablero",fichas=>{
      setContador(contador+1)
      console.log(fichas);
    });*/
    //console.log(tabla);


    setContador(1);

    props.socket.on("get-tablero", ({ fichas, turno }) => {
      setTablero(fichas);
      if(turno==-2){
        fin=0;
        setMensaje("Turno:  "); 
        setAlertWon(0);
      }
      else if (fin === 0) {
        console.log(mensaje);
        setMensaje("Turno:  "); 
        setContador(0);
        setTurn(turno);
        setContador(1);
        
      }


    });


    props.socket.on("final", ({ jugador, turno }) => {
      setMensaje("ganador: " + dic[jugador]);
      fin = 1;
      setAlertWon(1);


    });



  }, [])

  const jugada = (val, fila) => {
    for (var i = 5; i >= 0; i--) {
      if (tablero[i][fila] === 0) {
        tablero[i][fila] = val;
        break;
      }
    }
  }

  const paint = (value) => {
    var clase = "cell "
    if (value === 1) {
      clase += "roja"
    }
    else if (value === 2) {
      clase += "amarilla";
    }
    return (clase)
  }


  function chkLine(a, b, c, d) {
    // Check first cell non-zero and all cells match
    return ((a !== 0) && (a === b) && (a === c) && (a === d));
  }

  function chkWinner() {
    // Check down
    for (var r = 0; r < 3; r++)
      for (var c = 0; c < 7; c++)
        if (chkLine(tablero[r][c], tablero[r + 1][c], tablero[r + 2][c], tablero[r + 3][c]))
          return tablero[r][c];

    // Check right
    for (r = 0; r < 6; r++)
      for (c = 0; c < 4; c++)
        if (chkLine(tablero[r][c], tablero[r][c + 1], tablero[r][c + 2], tablero[r][c + 3]))
          return tablero[r][c];

    // Check down-right
    for (r = 0; r < 3; r++)
      for (c = 0; c < 4; c++)
        if (chkLine(tablero[r][c], tablero[r + 1][c + 1], tablero[r + 2][c + 2], tablero[r + 3][c + 3]))
          return tablero[r][c];

    // Check down-left
    for (r = 3; r < 6; r++)
      for (c = 0; c < 4; c++)
        if (chkLine(tablero[r][c], tablero[r - 1][c + 1], tablero[r - 2][c + 2], tablero[r - 3][c + 3]))
          return tablero[r][c];

    return 0;
  }
  /*
  const change_player= ()=>{
    if(player===1){setPlayer(2)}
    else{setPlayer(1)}
  }*/

  const validar_gane = () => {
    //validar_horizontal();
    //validar_vertical();

    var x = chkWinner();

    if (x !== 0) {
      props.socket.emit("ganador", player);

    }



  }

  const play = (i, j) => {
    if (turn !== player) { }
    else {
      jugada(player, j);
      validar_gane();
      //change_player()
      props.socket.emit("send-tablero", tablero);
    }

  }
  const reiniciar=() =>{
      props.socket.emit("send-tablero", 0);
      var x = Array(6).fill().map(()=>[0,0,0,0,0,0,0]);
      setMensaje("Turno:  "); 
      setTablero(x);
      
  }


  const tokens = tablero.map((filas, i) => filas.map((valor, j) => <div className={paint(tablero[i][j])} onClick={e => play(i, j)} key={(tablero[1].length * i) + j} ></div>));

  return (
    <div>
      <div className='grid'>
        {(contador === 1) && tokens}
        

      </div>
      
      {
        (alertWon===1)&&
        <div className='rematch'>
          <h1>{mensaje}</h1>
          <button className='cool' onClick={reiniciar}>Reiniciar juego</button>
        </div>
      }
      {!alertWon&&
      <div>
      <h1 >{mensaje}</h1>
      <div className={"dot " + clase[turn]} />
      </div>
      }
      
    </div>
  )

}
export default Board;