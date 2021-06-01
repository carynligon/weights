import React from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Flex, Link, Text, Box } from "rebass";

const Nav = ({ userAuthed }) => {
  const { pathname, push } = useRouter();

  const userSignOut = async () => {
    try {
      await firebase.auth().signOut();
      sessionStorage.removeItem("uid");
      push("/login");
    } catch (e) {
      console.error("error logging user out!", e);
    }
  };

  return (
    <Flex
      m={2}
      color="black"
      alignItems="center"
      sx={{ borderBottom: "3px solid black" }}
    >
      <Text p={2} fontWeight="bold">
        Weightssss
      </Text>
      <Box mx="auto" />
      <Link
        fontWeight="bold"
        sx={{ textDecoration: "underline" }}
        variant="nav"
        href={pathname.includes("log") ? "/" : "/log"}
      >
        {pathname.includes("log") ? "All logs" : "Add new"}
      </Link>
      {userAuthed && (
        <Link
          sx={{
            fontSize: 12,
            marginLeft: 2,
            ":hover": {
              cursor: "pointer",
            },
            textDecoration: "underline",
          }}
          fontWeight="bold"
          onClick={userSignOut}
        >
          Sign out
        </Link>
      )}
    </Flex>
  );
};

export default Nav;
