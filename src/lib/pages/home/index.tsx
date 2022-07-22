import {  VStack,Modal, Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer, } from "@chakra-ui/react";
import Hero from "../../components/hero";
import UseCases from "../../components/useCases";
import StartWorking from "../../components/startWorking";
import FAQ from '../../components/faq';

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

const returnNetworkInfoTable = () => {
  return(
    <TableContainer>
  <Table variant='simple'>
    
   
    <Tbody>
      <Tr>
        <Td>Chain Name</Td>
       
        <Td >Shine Network</Td>
      </Tr>
      <Tr>
        <Td>Chain Id</Td>
        
        <Td >431</Td>
      </Tr>
      <Tr>
        <Td>Currency Symbol</Td>
       
        <Td >SHINE</Td>
      </Tr>
       <Tr>
        <Td>JSON RPC</Td>
       
        <Td >http://144.126.252.83</Td>
      </Tr>
      
    </Tbody>
    
  </Table>
</TableContainer>
  )
}
  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>SHINE Network Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {returnNetworkInfoTable()}
          </ModalBody>

          <ModalFooter>
            <Button bg='brand.100' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>

       <VStack
      display={{ md: "flex" }}
      alignItems="center"
      minHeight="70vh"
      gap={8}
      mb={8}
      w="full"
    >
      <Hero click={onOpen} />
      <StartWorking />
      <UseCases />
      <FAQ/>
    </VStack>
    
    </>
   
  );
};

export default Home;
