"use client";

import Link from "next/link";
import { useAuth } from "../utils/context/authContext";

export default function HomePage() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return isLoggedIn ? (
    <div>
      <div>you are logged in!</div>
      <button onClick={logout}>logout</button>
    </div>
  ) : (
    <div>
      you are not logged in yet
      <button onClick={logout}>logout</button>
      <Link href="/login">Login</Link>
    </div>
  );
}
