import { useEffect, useContext, useState } from "react";
import { DBContext } from "../../../../context/DBContext";
import {
  VStack,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Input,
} from "@chakra-ui/react";
import Image from "next/image";

const SubmitNFTForSaleModal = ({ open, nftData, close }) => {
  const [price, setprice] = useState(null);
  const { listTokenForMarket, approveNFTForMarketplaceListing } = useContext(
    DBContext
  );
  const [loading, setLoading] = useState(false);
  const [isApproved, setApproved] = useState(false);

  const updatePrice = (e) => {
    setprice(e.target.value);
  };

  const listNFTInTheMarketplace = async () => {
    if (!nftData || !price) {
      return alert("Please fill the data");
    }

    if (isApproved) {
      setLoading(true);
      const error = await listTokenForMarket(nftData.tokenId, price);
      setLoading(false);
      close();
      if (error) {
        alert(`Listing failed ${error.message}`);
      }
    } else {
      setLoading(true);
      const approved = await approveNFTForMarketplaceListing(nftData.tokenId);
      if (approved) {
        setApproved(true);
      }
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={open} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell your NFT in the marketplace</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            {nftData && (
              <Image
                src={nftData.data.properties.image.description}
                width="150px"
                height="100px"
              />
            )}
            <Text>{nftData.data.properties.name.description}</Text>
            <Input placeholder="Sale price in USDT" onChange={updatePrice} />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={close} variant="ghost">
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={listNFTInTheMarketplace}
            isLoading={loading}
          >
            {isApproved ? " List in Marketplace" : "Approve For Listing"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubmitNFTForSaleModal;
