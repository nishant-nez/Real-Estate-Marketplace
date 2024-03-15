"use client";

import HeaderBox from "@/app/components/headerBox";
import { Toast } from "@/app/components/toast";
import { ListingType } from "@/app/interface/listingType";
import { BACKEND } from "@/app/utils/constants";
import { useAuth } from "@/app/utils/context/authContext";
import axios from "axios";
import { Metadata } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from "uuid";
import { config } from "react-spring";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import ShowerIcon from "@mui/icons-material/Shower";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CropFreeIcon from "@mui/icons-material/CropFree";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CorporateFare from "@mui/icons-material/CorporateFare";
import FeatureCard from "@/app/components/featureCard";
import UpdateListingForm from "@/app/components/updateListingForm";

type Props = {
  params: {
    listingId: string;
  };
};

// export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
//   return {
//     title: `Property ${params.listingId}`,
//   };
// };

export default function ListingDetails({ params }: { params: { listingId: string } }) {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [listing, setListing] = useState<ListingType | null>(null);
  const [slides, setSlides] = useState<any | null>(null);
  const [trigger, setTrigger] = useState<Boolean>(false);

  // dialog box
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND}/listing/${params.listingId}`);
        if (response.statusText === "OK") {
          setListing(response.data);
        } else {
          Toast("error", "Failed to load lastest listings!");
        }
      } catch (err: any) {
        console.error(`Error: ${err}`);
        Toast("error", err);
      }
    };

    fetchData();
  }, [trigger]);

  useEffect(() => {
    if (listing) {
      const imgList = listing.images.map((img, index) => ({
        key: uuidv4(),
        content: (
          <img
            key={index}
            // width={0}
            // height={0}
            // sizes="100vw"
            // style={{ width: "100%", height: "auto" }}
            src={`${BACKEND}/uploads/listings/${img}`}
            alt={`Slide ${index}`}
          />
        ),
      }));
      setSlides(imgList);
    }
  }, [listing]);

  useEffect(() => {
    console.log(slides);
  }, [slides]);

  return (
    <>
      <HeaderBox title="Listing Details" />
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <Stack direction="row" gap={3} alignItems="center" justifyContent="space-between">
          <Typography variant="h3">{listing?.title}</Typography>
          {user && listing && listing.user.id === user.id && (
            <Button
              onClick={handleClickOpen}
              fullWidth
              variant="contained"
              disabled={isLoading ? true : false}
              sx={{
                fontWeight: "bold",
                backgroundColor: "#fb6749",
                padding: 1.5,
                borderRadius: 7,
                maxWidth: 230,
                "&:hover": {
                  backgroundColor: "#282e38",
                },
              }}
            >
              Edit
            </Button>
          )}
        </Stack>
        <Typography variant="body1" marginTop={1} marginBottom={3}>
          {listing?.city}, {listing?.district}
        </Typography>

        <Container sx={{ width: "100%", height: "500px", margin: "0 auto" }}>
          {slides && <Carousel slides={slides} showNavigation goToSlide={0} offsetRadius={2} />}
        </Container>

        <Stack marginY={14} direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack width="50%">
            <Typography variant="h4">About this Property</Typography>
            <Typography variant="subtitle1">{listing?.description}</Typography>
          </Stack>
          <Container sx={{ width: "50%", backgroundColor: "#282e38", padding: 4, borderRadius: 2 }}>
            <Typography variant="h4" fontSize={22} color="white" fontWeight="bold" paddingTop={1} paddingBottom={2}>
              Features
            </Typography>

            <Grid container rowSpacing={2.5} columnSpacing={2.5} columns={2} justifyContent="space-between">
              <FeatureCard title="Stories" icon={CorporateFare} value={listing?.stories} />
              <FeatureCard title="Area" icon={CropFreeIcon} value={listing?.area} />
              <FeatureCard title="Bathroom" icon={ShowerIcon} value={listing?.bathroom} />
              <FeatureCard title="Bedroom" icon={HotelIcon} value={listing?.bedroom} />
              <FeatureCard title="Kitchen" icon={KitchenIcon} value={listing?.kitchen} />
              <FeatureCard title="Parking" icon={DirectionsCarIcon} value={listing?.car_parking} />
            </Grid>
          </Container>
        </Stack>
      </Container>

      <Container
        sx={{ width: "100vw", height: "50vh", backgroundColor: "#282e38", margin: 0, padding: 0, minWidth: "100%" }}
      >
        <Container>user details</Container>
      </Container>

      {listing && (
        <UpdateListingForm
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          listing={listing}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      )}
    </>
  );
}
