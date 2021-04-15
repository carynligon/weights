import React from "react";
import { useRouter } from "next/router";
import { Flex, Text, Box } from "rebass";
import Link from "next/link";

const Nav = () => {
  const { pathname } = useRouter();

  return (
    <Flex px={2} color="white" bg="black" alignItems="center">
      <Text p={2} fontWeight="bold">
        Weightssss
      </Text>
      <Box mx="auto" />
      <Link variant="nav" href={pathname.includes("log") ? "/" : "/log"}>
        {pathname.includes("log") ? "All logs" : "Add new"}
      </Link>
    </Flex>
  );
};

export default Nav;
