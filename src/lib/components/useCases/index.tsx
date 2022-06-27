import {
  VStack,
  Text,
  Wrap,
  Heading,
  Button,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/router";

const USECASES = [
  {
    title: "NFT Minting",
    image: "",
    link: "/dashboard/NftMinter",
  },
  {
    title: "Defi",
    image: "",
    link: "",
  },
  {
    title: "ERC20 tokens",
    image: "",
    link: "",
  },
  {
    title: "Token Bridging",
    image: "",
    link: "",
  },
  {
    title: "NFT bridging",
    image: "",
    link: "",
  },
];

const UseCases = () => {
  const UseCaseTile = ({ title, image, link }) => {
    const router = useRouter();

    // For routing to the desitnation page
    const handleOnClick = (e) => {
      e.preventDefault();
      router.push(link);
    };
    return (
      <VStack align="center" justify="center" onClick={handleOnClick}>
        <Button
          variant="outline"
          leftIcon={<BsFillPatchCheckFill color="green" />}
        >
          <Text>{title}</Text>
        </Button>
      </VStack>
    );
  };
  return (
    <VStack w="full" justify="center" p={8} spacing={8}>
      <Heading size="md">Things you can try Now</Heading>
      <Wrap w="full" align="center" shouldWrapChildren={true} spacing={4}>
        {USECASES.map((eachUseCase) => (
          <UseCaseTile
            key={`Things to do ${Math.random()}`}
            title={eachUseCase.title}
            image={eachUseCase.image}
            link={eachUseCase.link}
          />
        ))}
      </Wrap>
    </VStack>
  );
};

export default UseCases;
