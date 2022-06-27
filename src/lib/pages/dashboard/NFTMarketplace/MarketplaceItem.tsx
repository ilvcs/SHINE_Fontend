import { VStack, Button, Text, CircularProgress } from "@chakra-ui/react";

import { useEffect, useContext, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { DBContext } from "../../../../context/DBContext";
const MarketPlaceItem = ({ itemData }) => {
  const { fetchTokensUri, approveUSDCtoken, buyMarketplaceNFT } = useContext(
    DBContext
  );
  const [tokenUri, setTokenUri] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTsData();
  }, [itemData]);

  useEffect(() => {
    fetchNftDataFromURI();
  }, [tokenUri]);

  const fetchNFTsData = async () => {
    setFetching(true);
    const tokenURIs = await fetchTokensUri([itemData.tokenId]);
    console.log(`Token uris for each token ${tokenURIs}`);
    setTokenUri(tokenURIs[0]);
    setFetching(false);
  };

  const fetchNftDataFromURI = async () => {
    if (!tokenUri) {
      return;
    }

    try {
      console.log(`Token uri is ${tokenUri.tokenURI}`);
      setFetching(true);
      const res = await axios.get(tokenUri.tokenURI);
      const data = res.data;
      console.log(data.properties);
      setNftData(data);
      setFetching(false);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const buyNFT = async () => {
    if (!isApproved) {
      setLoading(true);
      const approve = await approveUSDCtoken(
        itemData.price.toString(),
        itemData.owner
      );
      console.log(`Is approved ${approve}`);
      if (approve) {
        setIsApproved(true);
      }
      return setLoading(false);
    } else {
      setLoading(true);

      const error = await buyMarketplaceNFT(itemData.marketId);

      if (error) {
        setLoading(false);
        return alert(`faild: ${error.message}`);
      }
      setLoading(false);
      return alert("Success");
    }
  };

  if (fetching) {
    return <CircularProgress />;
  }

  if (nftData) {
    return (
      <VStack h="150px" w="100px">
        <Image
          src={nftData.properties.image.description}
          width="100px"
          height="100px"
        />
        <Text>{nftData.properties.name.description}</Text>

        <Button
          size="sm"
          variant="solid"
          bg="brand.100"
          onClick={buyNFT}
          isLoading={loading}
        >
          <Text>{`${itemData.price.toString()} USDT`}</Text>
        </Button>
      </VStack>
    );
  }
};

export default MarketPlaceItem;
