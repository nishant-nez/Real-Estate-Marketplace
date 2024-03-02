"use client";

import Link from "next/link";
import { useAuth } from "../utils/context/authContext";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import BounceLoader from "react-spinners/BounceLoader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND } from "../utils/constants";
import { Toast } from "../components/toast";
import { ListingType } from "../interface/listingType";
import LatestListingCard from "../components/latestListingCard";

export default function HomePage() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const router = useRouter();

  const [latestListings, setLatestListings] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/search?limit=3`);
        if (response.statusText === "OK") {
          console.log(response.data);
          setLatestListings(response.data);
        } else {
          Toast("error", "Failed to load lastest listings!");
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
        Toast("error", err || "Server error");
      }
      console.log("latestListings : ", latestListings);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("latest listings: ", latestListings);
  }, [latestListings]);

  if (isLoading) {
    return <BounceLoader color="#36d7b7" size={150} />;
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
              backdropFilter: "none",
              transform: "scale(1.1)",
            }}
          ></Box>
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
      <Container maxWidth="lg" sx={{ paddingX: 10, marginY: 10 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center">
          <Stack gap={1}>
            <Typography variant="h3" fontWeight="bold">
              Latest Property Listings
            </Typography>
            <Typography variant="subtitle1">
              Our latest listings at a glance. Explore property from all sizes and types
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            onClick={() => router.push("/login")}
            sx={{
              borderRadius: 2,
              paddingX: 3,
              paddingY: 1,
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: [18],
              color: "#fb6749",
              borderColor: "#fb6749",
              "&:hover": {
                borderColor: "#fb6749",
                backgroundColor: "#fb6749",
                color: "white",
              },
            }}
          >
            Browse All Listings
          </Button>
        </Stack>

        <LatestListingCard latestListings={latestListings} />
      </Container>
    </>
  );
}
