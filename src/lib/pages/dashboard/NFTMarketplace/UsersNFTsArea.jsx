import { DBContext } from "../../../../context/DBContext";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Heading,
  VStack,
  Wrap,
  Text,
  Button,
  Badge,
} from "@chakra-ui/react";
import Image from "next/image";
import MarketItem from "../../../../modals/MarketItemModal";

function UsersNFTsArea({ click }) {
  const {
    listTokensOfOwner,
    account,
    fetchTokensUri,
    marketPlaceItems,
  } = useContext(DBContext);
  const [fetching, setfetching] = useState(false);
  const [userNfts, setUserNfts] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [tokenIpfsData, setTokenIpfsData] = useState([]);
  const [marketListedItemIds, setmarketListedItemIds] = useState([]);

  useEffect(() => {
    fetchUsersNFTs();
  }, [account]);

  useEffect(() => {
    fetchNFTsData();
  }, [userNfts]);

  useEffect(() => {
    fetchIPFSData();
  }, [nftData]);

  useEffect(() => {
    let ids = [];
    for (let i = 0; i < marketPlaceItems.length; i++) {
      const item = new MarketItem(marketPlaceItems[i]);
      if (item.state === "LISTED") {
        ids.push(parseInt(item.tokenId.toString()));
      }
    }

    console.log("Marketplace Ids", ids);
    setmarketListedItemIds([...ids]);
  }, [marketPlaceItems]);

  const fetchIPFSData = async () => {
    if (!nftData || nftData.length < 1) {
      return;
    }

    const dataList = [];
    try {
      for (var i = 0; i < nftData.length; i++) {
        const res = await axios.get(nftData[i].tokenURI);
        const data = res.data;
        console.log(data);
        dataList.push({ tokenId: nftData[i].tokenId, data: data });
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }

    return setTokenIpfsData([...dataList]);
  };

  const fetchNFTsData = async () => {
    if (!userNfts || userNfts.length < 1) {
      return setNftData([]);
    }
    setfetching(true);
    const tokenURIs = await fetchTokensUri(userNfts);
    setNftData([...tokenURIs]);
    setfetching(false);
  };

  const fetchUsersNFTs = async () => {
    if (!account) {
      return;
    }

    setfetching(true);
    try {
      const ownerNFTList = await listTokensOfOwner(account);
      console.log(`NFts that are fetched are ${JSON.stringify(ownerNFTList)}`);
      setUserNfts([...ownerNFTList]);
      setfetching(false);
    } catch (error) {
      console.log(`Error happend while fetching the users NFTs: ${error}`);
      setfetching(false);
    }
  };

  const returnUserNFTArea = () => {
    return (
      <Wrap>
        {tokenIpfsData.map((eachItem) => {
          return (
            <VStack h="150px" w="100px">
              <Image
                src={eachItem.data.properties.image.description}
                width="100px"
                height="100px"
              />
              <Text>{eachItem.data.properties.name.description}</Text>
              {marketListedItemIds.includes(eachItem.tokenId) ? (
                <Badge variant="outline" colorScheme="green">
                  Listed
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="solid"
                  bg="brand.100"
                  onClick={() => click(eachItem)}
                >
                  Sell
                </Button>
              )}
            </VStack>
          );
        })}
      </Wrap>
    );
  };
  return (
    <VStack w="full" h="full">
      {fetching ? <CircularProgress /> : returnUserNFTArea()}
    </VStack>
  );
}

export default UsersNFTsArea;
