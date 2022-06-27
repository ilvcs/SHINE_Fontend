import { HStack, Button, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useEthers } from "@usedapp/core";
import { ConnectWallet } from "../../../helpers/walletFunctions";
import { useContext } from "react";
import { DBContext } from "../../../context/DBContext";
import {shortenAddress} from '../../../helpers/walletFunctions'

const ConnectWithMetamask = ({ isMobile = false }) => {
  //const { activateBrowserWallet, account } = useEthers();
  const { connectWallet, account } = useContext(DBContext);

  return (
    <HStack
      minW={!isMobile && "128px"}
      as={Button}
      size={isMobile ? "sm" : "md"}
      borderRadius="10px"
      boxShadow="sm"
      onClick={connectWallet}
      variant="outline"
      borderColor="whiteAlpha.500"
      justify="space-between"
    >
      <Image
        width="30px"
        height="30px"
        alt="Metamask Login"
        objectFit="cover"
        src="/metamask.png"
      />
      <Text>{account ? shortenAddress(account) : "Connect"}</Text>
    </HStack>
  );
};

export default ConnectWithMetamask;
