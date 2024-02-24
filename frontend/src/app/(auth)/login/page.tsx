"use client";

import { BACKEND } from "@/app/utils/constants";
import axios from "axios";
import { useAuth } from "@/app/utils/context/authContext";
// import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Login() {
  //   const router = useRouter();

  const submit = async () => {
    console.log("login function called");
    try {
      const response = await axios.post(`${BACKEND}/user/login/`, {
        email: "admin2@gmail.com",
        password: "admin",
      });
      console.log(response);
    } catch (error) {
      console.log("login failed: ", error);
    }
  };

  const { user, isLoggedIn, isLoading, login, logout } = useAuth();

  const handleLogin = () => {
    login("admin2@gmail.com", "admin");
    redirect("/");
  };
  return (
    <div>
      login page
      <button onClick={handleLogin}>Login</button>
      <Link href="/">Home</Link>
    </div>
  );
}
