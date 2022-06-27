import {
  VStack,
  Heading,
  useDisclosure,
  Center,
  Wrap,
  CircularProgress,
  HStack,
} from "@chakra-ui/react";
import Links from "lib/components/links";
import { useEffect, useContext, useState } from "react";
import MarketItem from "../../modals/MarketItemModal";
import MarketPlaceItem from "../../lib/pages/dashboard/NFTMarketplace/MarketplaceItem";
import UsersNFTsArea from "lib/pages/dashboard/NFTMarketplace/UsersNFTsArea";
import SubmitNFTForSaleModal from "../../lib/pages/dashboard/NFTMarketplace/NFTSalePriceEntryModal";
import { DBContext } from "../../context/DBContext";

function NFTMarketPlace() {
  const { fetchMarketplaceItems, marketPlaceItems } = useContext(DBContext);
  const [fetching, setfetching] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [saleNFTData, setSaleNFTData] = useState(null);

  const openNFTSaleDialogue = (nftData) => {
    setSaleNFTData({ ...nftData });
    onOpen();
  };

  useEffect(() => {
    fetchNFTMarketplaceNFTs();
  }, []);
  const fetchNFTMarketplaceNFTs = async () => {
    setfetching(true);
    const items = await fetchMarketplaceItems();
    setfetching(false);
  };

  const returnNFTmarketPlace = () => {
    if (fetching) {
      return (
        <Center>
          <CircularProgress />
        </Center>
      );
    }
    return (
      <VStack w="full" h="full">
        <Wrap>
          {marketPlaceItems.map((eachItem) => {
            const item = new MarketItem(eachItem);
            return item.state === "LISTED" ? (
              <MarketPlaceItem itemData={item} />
            ) : (
              <></>
            );
          })}
        </Wrap>
      </VStack>
    );
  };

  return (
    <VStack w="full" minH="90vh" spacing={4}>
      <Links />
      {isOpen && saleNFTData && (
        <SubmitNFTForSaleModal
          open={isOpen}
          nftData={saleNFTData}
          close={onClose}
        />
      )}
      <HStack w="full" h="full" minH="90vh" align="top">
        <VStack
          w="250px"
          h="100%"
          borderRadius={4}
          border="1px"
          minH="70vh"
          spacing={4}
          p={4}
          overflowY="scroll"
          overflowX="hidden"
        >
          <Heading size="md">User NFTs</Heading>
          <UsersNFTsArea click={openNFTSaleDialogue} />
        </VStack>
        <VStack w="full" h="full" spacing={4} p={4}>
          <Heading size="md">Nft marketplace</Heading>
          {returnNFTmarketPlace()}
        </VStack>
      </HStack>
    </VStack>
  );
}

export default NFTMarketPlace;
