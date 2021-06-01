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
    <Flex flexDirection="column" alignItems="center">
      <Flex
        as="form"
        flexDirection="column"
        alignItems="center"
        margin="4rem auto"
        maxWidth="600px"
        onSubmit={handleSubmit}
      >
        <Flex justifyContent="flex-end" flexDirection="column">
          <Label htmlFor="email">Email</Label>
          <Input
            marginBottom={4}
            type="text"
            id="email"
            name="email"
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
        </Flex>
        <Button variant="outline" type="submit">
          Submit
        </Button>
      </Flex>
      <Link href="/login">Log in</Link>
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
