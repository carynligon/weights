import React, { useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Button, Flex, Link } from "rebass";
import { Input, Label } from "@rebass/forms";

const LoginPage = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccessful, setSignupStatus] = useState(undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setSignupStatus(true);
      push("/");
    } catch (e) {
      setSignupStatus(false);
    }
  };

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Flex
        as="form"
        backgroundColor="white"
        flexDirection="column"
        alignItems="center"
        maxWidth="600px"
        padding="5"
        sx={{
          borderRadius: "1rem",
          boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
        }}
        onSubmit={handleSubmit}
      >
        <Flex justifyContent="flex-end" flexDirection="column">
          <Label htmlFor="email">Email</Label>
          <Input
            backgroundColor="white"
            marginBottom={4}
            type="text"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            paddingX="3"
            paddingY="2"
            placeholder="email@email.com"
            minWidth="250px"
          ></Input>
        </Flex>
        <Flex justifyContent="flex-end" flexDirection="column">
          <Label htmlFor="password">Password</Label>
          <Input
            backgroundColor="white"
            marginBottom={4}
            type="password"
            id="password"
            minWidth="250px"
            name="password"
            paddingX="3"
            paddingY="2"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
        </Flex>
        <Button backgroundColor="black" type="submit">
          Submit
        </Button>

        <p>
          Don't have an account?
          <Link
            fontWeight="bold"
            marginTop="5"
            padding="1"
            sx={{ textDecoration: "underline" }}
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
