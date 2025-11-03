import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
const [socket,setSocket]=useState(null)
const [message,setMessage]=useState("")
const [socketId,setSocketId]=useState("")
const[allMessages,setAllMessages]=useState([])
const[roomName,setRoomName]=useState()
useEffect(() => {
    const socket = io("http://localhost:4000"); // Your backend URL

    // socket.on("forAllMessage", (searchData) => {
    //   console.log(searchData);
    // });

     socket.on("foronlyMe", (searchData) => {
      console.log(searchData);
    });

    socket.on("personal-msg", (msg) => {
      console.log(msg);
      setAllMessages(prev=>[...prev, msg])
    });

    socket.on("connect", () => {
      console.log("user connected");
      // console.log("socket id ", socket.id);
      setSocket(socket)
    });
    //cline up function for unmount 
    return()=>{
      socket.disconnect()
    }
  }, []);
  const handlerSubmit =(e)=>{
e.preventDefault()
socket.emit("send-message",{msg:message,id:socketId})
setMessage("")
  }
  const roomJoinHandler=(e)=>{
    e.preventDefault()
    socket.emit("join-room",roomName)
    setRoomName("")
  }
  return (
    <div>
      <h2>Chat App</h2>
      <form onSubmit={handlerSubmit}>
        {socket?.id}
        <input type="text" value={message}
        onChange={(e)=>{setMessage(e.target.value)}}
        placeholder="Enter your message"/>
        <input type="text"
        value={socketId}
         onChange={(e)=>{
          setSocketId(e.target.value)
        }} placeholder="enter socketId "  />
 <button type="submit">Send message</button>
 {
  allMessages.map((msg,index)=>{
    return <p key={index}>{msg}</p>
  })
 }
      </form>

      <form onSubmit={roomJoinHandler}>

        <input type="text" value={roomName} placeholder="room name"
        onChange={(e)=>setRoomName(e.target.value)}/>
        <button type="submit">Join room</button>
      </form>
    </div>
  );
}

export default App;
