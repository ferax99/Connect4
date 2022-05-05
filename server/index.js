const puerto = 4001;
var jugador=0;
var turno=1;

const board = Array(6).fill().map(()=>[0,0,0,0,0,0,0]);

const io = require('socket.io')(puerto,{
        cors:{origin:"*"},
    })


io.on("connection",socket=>{
    console.log(socket.id);
    socket.on("send-tablero",fichas=>{
        
        turno = (turno%2)+1;
        console.log(turno)
        if(fichas!==0){
            io.emit("get-tablero",{fichas:fichas,turno:turno})
        }
        else{io.emit("get-tablero",{fichas:board,turno:-2})}
        
    })
    
    socket.on("send-player",x=>{
        jugador = (jugador%2)+1;
        io.to(socket.id).emit("get-player",jugador);
    
    })
    socket.on("ganador",player=>{
        jugador = player;
        io.emit("final",{jugador:jugador,turno:jugador})
        
    
    })
    
})


console.log("Esperando conexion en: "+puerto)
