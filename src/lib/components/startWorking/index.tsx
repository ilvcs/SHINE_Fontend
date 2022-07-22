import {
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { app, auth, db, functions } from "../../../firebase/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import axios from "axios";
const SEND_SHINE_TOKENS_URL_LOCAL = "http://localhost:5001/shine-38d71/us-central1/sentShineTokens";
const SEND_SHINE_TOKENS_URL = ' https://us-central1-shine-38d71.cloudfunctions.net/sentShineTokens'
  
const StartWorking = () => {
  const [loading, setloading] = useState(false);
  const [inputError, setInputError] = useState("");
  const [ethAddress, setEthAddress] = useState("");

  // useEffect(() => {
  //   console.log(app, functions);
  // }, []);

  const handleChange = (event) => {
    if (!!inputError && inputError.length > 1) {
      setInputError("");
    }
    setEthAddress(event.target.value);
  };

  const onShineRequested = async () => {
    if (!ethAddress || ethAddress.length !== 42) {
      return setInputError("Please enter a valid ETH address");
    }
    setloading(true);
    try {
      const response = await axios.post(SEND_SHINE_TOKENS_URL, null, {
        params: {
          sendTo: ethAddress,
        },
      });

      console.log(` Response from the server is ${response}`);
      if (!!response.error) {
        console.log(`Error While Transfering SHINE ${response.error}`);
      } else {
        console.log(`Transferd successfully, Hash is : ${response.txHash}`);
      }
      setloading(false);
    } catch (error) {
      console.log("Error" + error);
      setloading(false);
    }
  };

  return (
    <VStack
      w="full"
      p={10}
      mx="md"
      spacing={8}
      borderRadius={8}
      borderWidth={1}
      borderColor="brand.100"
    >
      <Heading size="md"> SHINE Faucet</Heading>
      <VStack w="full" spacing={4} pt={6}>
        <Input
          placeholder="Paste your ETH address here"
          onChange={handleChange}
        />
        <Text color="red" fontSize="xs">
          {inputError}
        </Text>
        <Button borderColor="white" onClick={onShineRequested}>
          {loading ? <Spinner /> : <Text>Request 1 SHINE</Text>}
        </Button>
      </VStack>
    </VStack>
  );
};

export default StartWorking;

const adShineToMetamask = async () => {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xf00" }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xf00",
              chainName: "...",
              rpcUrls: ["https://..."] /* ... */,
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
};
