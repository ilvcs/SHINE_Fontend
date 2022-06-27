import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { AddShineToMetamask } from "../../../helpers/walletFunctions";
import React from "react";

const Hero = () => {
  return (
    <VStack w="full" h={60} justify="center" spacing={8}>
      <Heading size="lg" textAlign="center">
        SHINE is an EVM compatable blockchain network build using Poygon Edge.
      </Heading>
      <Button variant="filled" bg="brand.100" onClick={AddShineToMetamask}>
        <Text>Swich to SHINE</Text>
      </Button>
    </VStack>
  );
};

export default Hero;
