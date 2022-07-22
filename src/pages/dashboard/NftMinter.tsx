import {
  HStack,
  VStack,
  Box,
  Center,
  Button,
  Spacer,
  Input,
  Text,
  Heading,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useRef, useContext } from "react";
import Links from "../../lib/components/links";
import { BiImages } from "react-icons/bi";

import { create } from "ipfs-http-client";
import { DBContext } from "../../context/DBContext";

const client = create("https://ipfs.infura.io:5001/api/v0");

const NftMinter = () => {
  const { mintERC721NFT } = useContext(DBContext);

  const [name, setName] = useState("");
  const [description, setDescriptio] = useState("");
  const [fields, setFields] = useState([]);
  const [imageData, setImageData] = useState(null);
  const inputRef = useRef();
  const [imageURL, setImageUrl] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mintedUrls, setMintedUrls] = useState([]);

  // Adds Custom Field to the input form
  const addField = () => {
    return setFields([...fields, {}]);
  };

  // 1) Publish the NFT metadata to the ipfs and ge the hash
  // 2) We ll create the url with the returnd ipfs to store as NFT uri
  // 3) We ll mint NFT with
  const createERC721NFT = async () => {
    if (!imageURL || name.length < 4 || description.length < 10) {
      return alert("Please fill all the details");
    }
    const metaData = {
      title: "Asset Metadata",
      type: "object",
      properties: {
        name: {
          type: "string",
          description: `${name}`,
        },
        description: {
          type: "string",
          description: `${description}`,
        },
        image: {
          type: "string",
          description: `${imageURL}`,
        },
      },
    };
    console.log(metaData);

    try {
      const added = await client.add(JSON.stringify(metaData));
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(`The data url is  ${url}`);
      setImageUrl(imageURL);
      setLoading(true);
      await mintERC721NFT(url);
      setLoading(false);
      console.log("Minted the nft");
      setMintedUrls([...mintedUrls, imageURL]);
    } catch (error) {
      setLoading(false);
      console.log("Error uploading file: ", error);
    }
  };

  /**
   * On image selected, it will post the image data to ipfs and
   * gets the hash from the ipfs and we ll crete an uri
   * with it and save in the state to post along with the
   * other metadata.
   * @param e : Event Obj
   */
  const onImageChange = async (e) => {
    setImageData(null);
    const file = e.target.files[0];
    setImageUploading(true);
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(`the image url is ${url}`);
      setImageUploading(false);
      setImageUrl(url);
    } catch (error) {
      setImageUploading(false);

      console.log("Error uploading file: ", error);
    }
  };
  return (
    <VStack w="full" minH="70vh">
      <Links />
      <HStack w="full" align="top">
        <VStack w="40%" h="full" spacing={8}>
          <Box
            w="full"
            h="400px"
            bg="whiteAlpha.100"
            borderRadius={10}
            boxShadow={20}
            as={Button}
            onClick={inputRef ? () => inputRef.current?.click() : null}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onImageChange}
              ref={inputRef}
            />
            {!!imageURL ? (
              <img
                src={imageURL}
                alt="NFt image"
                width="600px"
                height="400px"
              />
            ) : (
              <Center>
                {imageUploading ? <Spinner /> : <BiImages size="60px" />}
              </Center>
            )}
          </Box>

          <Button
            borderColor="brand.100"
            variant="outline"
            onClick={createERC721NFT}
            disabled={!imageURL || name.length < 4 || description.length < 10}
            isLoading={loading}
            loadingText="Minting your NFT"
          >
            Mint NFT
          </Button>
        </VStack>
        <Box w="60%" pt={4}>
          <VStack w="full" pl={8} spacing={8}>
            <Input
              placeholder="Name"
              value={name}
              variant="flushed"
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
            value={description}
              placeholder="Description"
             onChange={(e) => setDescriptio(e.target.value)}
            />

            {fields.map((eachField) => (
              <HStack w="full" spacing={8}>
                <Input variant="flushed" placeholder="Title" />
                <Input variant="flushed" placeholder="Data" />
              </HStack>
            ))}
            <Spacer />
           
          </VStack>
        </Box>
      </HStack>
    </VStack>
  );
};

export default NftMinter;
