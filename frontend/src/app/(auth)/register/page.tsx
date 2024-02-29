"use client";

import { useAuth } from "@/app/utils/context/authContext";
// import { useRouter } from "next/router";
import { redirect, useRouter } from "next/navigation";
import { Container, Stack, Typography, Button, Box, TextField, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";
import { Toast, ToastBox } from "@/app/components/toast";
import AuthBox from "@/app/components/authBox";
import LoginForm from "@/app/components/loginform";

export default function Register() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailValidate, setEmailValidate] = useState<string>("");
  const [passwordValidate, setPasswordValidate] = useState<string>("");

  const router = useRouter();

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  const handleSubmit = async () => {
    setEmailValidate("");
    setPasswordValidate("");

    if (email === "") setEmailValidate("Email is required");
    if (password === "") setPasswordValidate("Password is required");
    if (email !== "" && !isValidEmail(email)) setEmailValidate("Enter a valid Email Address");

    if (emailValidate === "" && passwordValidate === "" && isValidEmail(email) && password.length > 0) {
      console.log("all things validated");
      login(email, password);
    }

    // console.log(response);
  };

  return (
    <>
      <AuthBox title="Register" />

      <Container maxWidth="lg" sx={{ paddingX: 10, marginY: 10 }}>
        <Stack direction="row" alignItems="start" justifyContent="space-between">
          <Container>
            <Typography variant="h4" mb={2}>
              Sign up
            </Typography>
            <Typography variant="subtitle1">
              Unlock access to exclusive listings by creating your account today! Join our real estate community and
              discover your dream home. <br />
              Already have an account?
            </Typography>
            <Button
              variant="text"
              sx={{ color: "#fb6749", textTransform: "capitalize", paddingX: 0 }}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </Container>
          <Container maxWidth="sm" sx={{ marginLeft: 0, marginRight: 0 }}>
            <Box
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 4,
                py: 6,
                // marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  error={emailValidate === "" ? false : true}
                  helperText={emailValidate}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // autoFocus
                />
                <TextField
                  error={passwordValidate === "" ? false : true}
                  helperText={passwordValidate}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Stack direction="row" gap={0} justifyContent="space-between" alignItems="center" mt={2}>
                  <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                  <Button variant="text" sx={{ color: "#fb6749", textTransform: "capitalize" }}>
                    Forgot Password?
                  </Button>
                </Stack>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
                  disabled={isLoading ? true : false}
                  sx={{
                    mt: 4,
                    mb: 2,
                    backgroundColor: "#fb6749",
                    padding: 1.5,
                    borderRadius: 7,
                    "&:hover": {
                      backgroundColor: "#282e38",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  <Typography variant="body2">No Account?</Typography>
                  <Button
                    variant="text"
                    sx={{ color: "#fb6749", textTransform: "capitalize" }}
                    onClick={() => router.push("/register")}
                  >
                    Sign Up
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Container>
        </Stack>
      </Container>
    </>
  );
}
