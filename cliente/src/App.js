import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from './Components/Board';
//https://coolors.co/palette/06aed5-086788-f0c808-fff1d0-dd1c1a
const puerto = 4001;
const socket = io.connect('http://192.168.0.9:'+puerto)
var x = Array(6).fill().map(()=>[0,0,0,0,0,0,0]);

function App() {
  
  const [tablero, setTablero] = useState(x)
  const [contador,setContador]= useState(0);

  const [player,setPlayer]= useState(0);
  
  





  useEffect(() => {
    
    
    socket.on(('connect'), () => {
      console.log("conectado al socket en: "+socket.id)
      
    })
    socket.emit("send-player");
    socket.on('get-player',jugador=>{
      setPlayer(jugador);
      console.log("jugador:"+jugador);
    })
 
    

  },[])
  const Pcolor= ()=>{
    var cell = "dot ";
    if(player===1){return(cell+"roja")}
    return(cell+"amarilla")
    
  }

  

  
  

  return (
    <div className='all'>
      
      <div className='centrada'>
      {(player!==0)&&
      <div>
        <h2 >Connect<h1 className='title' >4</h1> </h2>
        <h1>Tu color  <div className={Pcolor()}></div></h1>
      <Board tablero={tablero} socket={socket} player={player}/>
      </div>
      }
      </div>    
          

     {/*  <h1>Tu id de usuario: {socket.id}</h1>
    */}
    </div>
  );
}

export default App;
