import React, { useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Button, Flex, Link } from "rebass";
import { Label, Input } from "@rebass/forms";

const SignupPage = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccessful, setSignupStatus] = useState(undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      setSignupStatus(true);
      push("/");
    } catch (e) {
      setSignupStatus(false);
    }
  };

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
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
            marginBottom={4}
            type="text"
            id="email"
            name="email"
            paddingX="3"
            paddingY="2"
            minWidth="250px"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
          ></Input>
        </Flex>
        <Flex justifyContent="flex-end" flexDirection="column">
          <Label htmlFor="password">Password</Label>
          <Input
            marginBottom={4}
            type="password"
            id="password"
            name="password"
            paddingX="3"
            paddingY="2"
            minWidth="250px"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
        </Flex>
        <Button backgroundColor="black" type="submit">
          Submit
        </Button>

        <p>
          Already have an account?
          <Link
            fontWeight="bold"
            marginTop="5"
            padding="1"
            sx={{ textDecoration: "underline" }}
            href="/login"
          >
            Log in
          </Link>
        </p>
      </Flex>
    </Flex>
  );
};

export default SignupPage;

const object = {
  name: "Caryn",
  age: 27,
};

Object.entries(object);
// [['name', 'Caryn'], ['age', 27]]
