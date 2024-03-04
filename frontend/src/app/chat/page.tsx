"use client";
import { BACKEND } from "../utils/constants";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAuth } from "../utils/context/authContext";
import HeaderBox from "../components/headerBox";
// console.log(socket);

export default function Chat() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [title, setTitle] = useState<string[]>([]);
  const [myRooms, setMyRooms] = useState<any[]>();
  const [selectedRoom, setSelectedRoom] = useState<any>();

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

  const joinRoom = (room: any) => {
    console.log("clicked joinRoom");
    socket.emit("joinRoom", room);
  };

  const leaveRoom = (room: any) => {
    console.log("clicked leaveRoom");
    socket.emit("leaveRoom", room);
  };

  const addMessage = (message: any) => {
    socket.emit("addMessage", message);
  };

  socket.on("messageAdded", (value) => {
    console.log("Added Message: ", value);
  });

  // Listen for incoming messages
  socket.on("message", (value) => {
    setTitle([...title, value]);
    console.log("Received message: ", value);
    // Handle the received message as needed
  });

  socket.on("messages", (value) => {
    console.log("Received Message: ", value);
  });

  socket.on("rooms", (value) => {
    setMyRooms(value);
    // console.log("Received rooms:", value);
    // console.log(myRooms);
    // Handle the received message as needed
  });

  useEffect(() => {
    if (myRooms) {
      console.log("myRooms: ", myRooms);
      // setSelectedRoom(myRooms[0].id);
    }
  }, [myRooms]);

  useEffect(() => {
    console.log("selected room: ", selectedRoom);
    // joinRoom(selectedRoom);
  }, [selectedRoom]);

  // return () => {
  //   socket.disconnect();
  // };
  //   }, []);

  const handleClick = () => {
    console.log(socket);
    console.log(user);
  };

  return (
    <>
      <HeaderBox title="Conversations" />
      chatpage
      <button onClick={handleClick}>status</button>
      <Button
        variant="contained"
        onClick={() => {
          const msg = {
            text: "check for the message at time 817",
            user: user,
            room: selectedRoom,
          };
          addMessage(msg);
        }}
      >
        Add Message
      </Button>
      <div>{title}</div>
      <button onClick={createRoom}>Create Room</button>
      <div>rooms: </div>
      <div>{JSON.stringify(myRooms)}</div>
      <Stack direction="row" spacing={3}>
        <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rooms</TableCell>
                {/* <TableCell>Conversations</TableCell> */}
              </TableRow>
            </TableHead>
            {myRooms ? (
              <TableBody>
                {/* <TableRow>
                <TableCell>1</TableCell>
                <TableCell rowSpan={myRooms.length}>
                  {selectedRoom ? console.log("selected") : console.log("not selectyed")}
                </TableCell>
              </TableRow> */}
                {/* {myRooms.map((room) => )} */}
                {myRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell
                      onClick={() => {
                        leaveRoom(selectedRoom);
                        setSelectedRoom(room);
                        joinRoom(room);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      ({room.id}) {room.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <p>no ROoms foound!</p>
            )}
          </Table>
        </TableContainer>
        {/* <div></div> */}
        {!selectedRoom ? (
          <div>no room selected</div>
        ) : (
          <div>
            id: {selectedRoom.id} <br />
            name: {selectedRoom.name} <br />
            created_at: {selectedRoom.created_at} <br />
            users: <br />
            {selectedRoom.users.map((user) => (
              <div key={user.id}>
                Name: {user.name}, email: {user.email}
                <br />
              </div>
            ))}
          </div>
        )}
      </Stack>
    </>
  );
}
