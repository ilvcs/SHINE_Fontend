import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/shine-logo.png";

import ThemeToggle from "./ThemeToggle";
import ConnectWithMetamask from "../components/header/ConnectWithMetamask";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Heading as="h1" size="md">
        <Link href="/">
          <Image src={logo} width="120px" height="100px" />
        </Link>
      </Heading>

      <Box marginLeft="auto">
        <HStack spacing={2}>
          <ConnectWithMetamask />
          <ThemeToggle />
        </HStack>
      </Box>
    </Flex>
  );
};

export default Header;
