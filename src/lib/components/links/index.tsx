import React from "react";
import { HStack, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import {useRouter} from 'next/router';

function Links() {
  const router  = useRouter()

  return (
    <HStack w="full" spacing="20px" px="8px" pb="20px">
      <Button size="sm" variant="link">
        <Link href="/">
          <Text fontSize="xs" color="gray.400" >
            {" "}
            HOME
          </Text>
        </Link>
      </Button>
       <Button size="sm" variant="link">
        <Link href="/dashboard/NftMinter">
          <Text fontSize="xs" color="gray.400" as={ router.pathname === "/dashboard/NftMinter"  && 'u'}>
            NFT MINTER{" "}
          </Text>
        </Link>
      </Button>
      <Button size="sm" variant="link">
        <Link href="/dashboard/NFTMarketPlace">
          <Text fontSize="xs" color="gray.400" as={ router.pathname === "/dashboard/NFTMarketPlace"  && 'u'} >
            {" "}
            NFT MARKTPLACE
          </Text>
        </Link>
      </Button>
     
      <Button size="sm" variant="link">
        <Link href="/dashboard/MintStableCoins">
          <Text fontSize="xs" color="gray.400" as={ router.pathname === "/dashboard/MintStableCoins"  && 'u'}>
            SUSDC MINTER{" "}
          </Text>
        </Link>
      </Button>
    </HStack>
  );
}

export default Links;
