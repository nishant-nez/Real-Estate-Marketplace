"use client";
import { BACKEND } from "../utils/constants";
import { useEffect, useState } from "react";
import { socket } from "./socket";

// console.log(socket);

export default function Chat() {
  const [title, setTitle] = useState<string[]>([]);
  const [myRooms, setMyRooms] = useState([]);

  //   useEffect(() => {
  socket.connect();
  socket.on("connect", () => console.log("connected"));
  socket.on("disconnect", () => console.log("disconnected"));

  const createRoom = () => {
    const user2 = { id: 3 };
    const room = {
      name: "TEST ROOM 901",
      users: [user2],
    };

    socket.emit("createRoom", room);
  };

  // Listen for incoming messages
  socket.on("message", (value) => {
    setTitle([...title, value]);
    console.log("Received message:", value);
    // Handle the received message as needed
  });

  socket.on("rooms", (value) => {
    setMyRooms(value);
    console.log("Received rooms:", value);
    console.log(myRooms);
    // Handle the received message as needed
  });

  // return () => {
  //   socket.disconnect();
  // };
  //   }, []);

  const handleClick = () => {
    console.log(socket);
  };

  return (
    <div>
      chatpage
      <button onClick={handleClick}>status</button>
      <div>{title}</div>
      <button onClick={createRoom}>Create Room</button>
      <div>rooms: </div>
      <div>{JSON.stringify(myRooms)}</div>
    </div>
  );
}
