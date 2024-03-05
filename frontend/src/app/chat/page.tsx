"use client";

import { BACKEND } from "../utils/constants";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { Avatar, Box, Button, Container, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../utils/context/authContext";
import HeaderBox from "../components/headerBox";
import { UserType } from "../interface/userType";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

export default function Chat() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [title, setTitle] = useState<string[]>([]);
  const [myRooms, setMyRooms] = useState<any[]>();
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const [roomMessages, setRoomMessages] = useState<any[]>();
  const [newMessage, setNewMessage] = useState("");

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
    setRoomMessages(value);
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

  return (
    <>
      <HeaderBox title="Conversations" />
      <Container sx={{ marginY: 10, width: "80%" }}>
        {myRooms && (
          <Stack direction="row" justifyContent="space-between">
            <Stack
              divider={<Divider orientation="horizontal" flexItem sx={{}} />}
              gap={2.5}
              // marginY={4}
              minWidth="30%"
              // maxWidth="30%"
              sx={{ border: "1px solid black", borderRadius: "10px 0 0 10px", padding: 4 }}
            >
              {myRooms.length > 0 &&
                user &&
                myRooms.map((room) => (
                  // Use a fragment or a container to wrap the elements returned by map
                  <React.Fragment key={room.id}>
                    {room.users.map((Seluser: UserType) => {
                      // Check if the user id is not equal to the current user id
                      if (Seluser.id !== user.id) {
                        return (
                          <React.Fragment key={Seluser.id}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={3}
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                leaveRoom(selectedRoom);
                                setSelectedRoom(room);
                                joinRoom(room);
                              }}
                            >
                              <Avatar alt="user avatar" src={`${BACKEND}/uploads/avatars/${Seluser.avatar}`} />
                              <Typography>{user.name}</Typography>
                            </Stack>
                          </React.Fragment>
                        );
                      }
                      // Return null if the condition is not met
                      return null;
                    })}
                  </React.Fragment>
                ))}
            </Stack>

            <Container
              sx={{
                width: "70%",
                minHeight: "75vh",
                border: "1px solid black",
                borderRadius: "0 10px 10px 0",
                margin: 0,
                // overflowY: "scroll",
                position: "relative",
                paddingBottom: "70px",
              }}
              style={{ padding: 0 }}
            >
              {!selectedRoom ? (
                <Typography>No Rooms Selected!</Typography>
              ) : (
                <Stack paddingBottom="75px" sx={{ overflowY: "scroll" }}>
                  <Box sx={{ padding: 4, backgroundColor: "#282e38", color: "white", marginBottom: 2 }}>
                    <Typography>
                      ({selectedRoom.id}) {selectedRoom.name}
                    </Typography>
                    <Typography>
                      {selectedRoom.users.map((user: UserType) => (
                        <Typography key={user.id}>
                          [Name: {user.name}, email: {user.email}]
                        </Typography>
                      ))}
                    </Typography>
                  </Box>
                  {roomMessages &&
                    roomMessages.map((msg) => {
                      return (
                        <Stack
                          key={msg.id}
                          marginLeft={msg.user.id === user?.id ? "auto" : 2}
                          sx={{
                            // border: "3px solid black",
                            display: "inline-block",
                            maxWidth: "fit-content",
                            borderRadius: 2,
                            padding: 2,
                            marginRight: 2,
                            marginBottom: 2,
                            backgroundColor: msg.user.id === user?.id ? "#fb6749" : "#7fcfdf",
                            color: msg.user.id === user?.id ? "white" : "black",
                            // marginLeft: "auto",
                            // marginLeft: {msg.user.id === user.id ? "auto" : "none"},
                          }}
                          // alignItems="flex-end"
                        >
                          <Typography>{msg.user.name}</Typography>
                          <Typography>{msg.text}</Typography>
                          {/* <Divider /> */}
                        </Stack>
                        // <Stack key={msg.id}>
                        // </Stack>
                      );
                    })}
                  <Stack
                    direction="row"
                    gap={2}
                    justifyContent="center"
                    sx={{
                      bottom: 0,
                      position: "absolute",
                      width: "94%",
                      marginBottom: 4,
                      marginX: 4,
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Send Message"
                      variant="standard"
                      fullWidth
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={() => {
                        const msg = {
                          text: newMessage,
                          user: user,
                          room: selectedRoom,
                        };
                        setNewMessage("");
                        addMessage(msg);
                      }}
                    >
                      Send
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Container>
          </Stack>
        )}
        {!myRooms && (
          <Stack justifyContent="center" alignItems="center" height="40vh">
            <Typography>No Recent Conversations!</Typography>
          </Stack>
        )}
      </Container>
    </>
  );
}
