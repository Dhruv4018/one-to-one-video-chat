import http from "http"
import { Server } from "socket.io"
import { v4 as uuid } from "uuid"
import dotenv from "dotenv"
dotenv.config()
const port = process.env.PORT || 5000

const server = http.createServer()

const io = new Server(server, { cors: { origin: "*" } })
const waitingQ = []
const activeParies = new Map()
io.on("connection", (socket) => {

    if (waitingQ.includes(socket.id)) return
    socket.on("start", () => {
        if (waitingQ.length > 0) {
            const partner = waitingQ.shift()
            const roomId = uuid()
            activeParies.set(socket.id, partner)
            activeParies.set(partner, socket.id)
            socket.emit("matched", { roomId })
            socket.to(partner).emit("matched", { roomId })



        } else {
            waitingQ.push(socket.id)
            socket.emit("waiting")
        }
    })

    socket.on("next",()=>{
        handleLeave(socket.id)
    })

    socket.on("disconnect",()=>handleLeave(socket.id))

    function handleLeave(id){
      const index =   waitingQ.indexOf(id)
      if(index!==-1){waitingQ.splice(index,1)}
      const partner = activeParies.get(id)
      if(partner){
        io.to(partner).emit("partner_left")
        activeParies.delete(id)
        activeParies.delete(partner)

      }
    }



})
server.listen(port, () => {
    console.log("Server is started at", port);
})

