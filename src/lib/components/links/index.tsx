import React from "react";
import { HStack, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
function Links() {
  return (
    <HStack w="full" spacing="20px" px="8px" pb="20px">
      <Button size="sm" variant="link">
        <Link href="/">
          <Text fontSize="xs" color="gray.400">
            {" "}
            PROFILE
          </Text>
        </Link>
      </Button>
      <Button size="sm" variant="link">
        <Link href="/dashboard/NFTMarketPlace">
          <Text fontSize="xs" color="gray.400">
            {" "}
            NFT MARKTPLACE
          </Text>
        </Link>
      </Button>
      <Button size="sm" variant="link">
        <Link href="/dashboard/NftMinter">
          <Text fontSize="xs" color="gray.400">
            NFT MINTER{" "}
          </Text>
        </Link>
      </Button>
    </HStack>
  );
}

export default Links;
