import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Heading,
  Box,
} from '@chakra-ui/react'

const questions = [
  {
    question:'What is Polygon Edge',
    answer:'A modular and extensible framework for building private or public Ethereum-compatible blockchain networks.',
    link:''
  },
  {
    question:'What is the usecase for Polygon Edge',
    answer:'Its primary use is to bootstrap a new blockchain network while providing full compatibility with Ethereum smart contracts and transactions. It uses IBFT (Istanbul Byzantine Fault Tolerant) consensus mechanism, supported in two flavours as PoA (proof of authority) and PoS (proof of stake).',
    link:''
  },
  {
    question:'What can i do with this website',
    answer:'This is an open sourced no-code environment running on Shine blockchain which is created using Polygon Edge. The main functionality of this block chain is to test how the edge blockchain works for various applications and as we are opensourcing all the code for smart contracts and frontend, any one can use the front end code or smart contracts to create their their own dApp. ',
    link:''
  }
]
const FAQTile = ({questionData}) => {
  const {question, answer, link} = questionData;
  return(
    <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          {question}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
     {answer}
    </AccordionPanel>
  </AccordionItem>
  )
}

function FAQ() {
  return (
    <VStack w='full' h='full' align='center' spacing={8}>
      <Heading size='md'>FAQ</Heading>
      <Accordion w='full' >
         {
        questions.map(eachQuestion => {
          return <FAQTile questionData={eachQuestion}/>
        })
      }
      </Accordion>
     

    </VStack>
  )
}

export default FAQ