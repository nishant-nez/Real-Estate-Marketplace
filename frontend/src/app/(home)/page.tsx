"use client";

import Link from "next/link";
import { useAuth } from "../utils/context/authContext";
import Navbar from "../components/navbar";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function HomePage() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {/* <Navbar /> */}
      <Box sx={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        <Box sx={{ top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
          <Box
            component="div"
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              filter: "blur(3px) brightness(0.5)",
              backgroundImage: "url('/modern_building.jpg')",
              overflow: "hidden",
              // filter: "brightness(0.5)",
              // backgroundColor: "rgba(0, 0, 0, 1)",
              backdropFilter: "none",
              transform: "scale(1.1)",
            }}
          >
            {/* <Image
            src="/modern_building.jpg"
            alt="modern house"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          /> */}
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            textAlign: "left",
            color: "white",
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            Find your perfect <br /> property with us
          </Typography>
          <Typography variant="subtitle1" lineHeight="3">
            Find your perfect property here!
          </Typography>
        </Box>
      </Box>
    </>
  );
}
