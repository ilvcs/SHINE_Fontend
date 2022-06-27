import { Box, Heading, VStack } from "@chakra-ui/react";
import Hero from "../../components/hero";
import UseCases from "../../components/useCases";
import StartWorking from "../../components/startWorking";

const Home = () => {
  return (
    <VStack
      display={{ md: "flex" }}
      alignItems="center"
      minHeight="70vh"
      gap={8}
      mb={8}
      w="full"
    >
      <Hero />
      <StartWorking />
      <UseCases />
    </VStack>
  );
};

export default Home;
