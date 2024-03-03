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
// import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from "uuid";

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
  }, []);

  useEffect(() => {
    if (listing) {
      const imgList = listing.images.map((img, index) => ({
        key: uuidv4(),
        content: <img key={index} src={`${BACKEND}/uploads/listings/${img}`} alt={`Slide ${index}`} />,
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
      <h1>Details about listing {params.listingId}</h1>

      {/* {slides && <Carousel slides={slides} showNavigation={true} />} */}
    </>
  );
}
