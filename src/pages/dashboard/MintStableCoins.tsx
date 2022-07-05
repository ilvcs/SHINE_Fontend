import { VStack,Text, Input, Button } from '@chakra-ui/react'
import {useState, useContext, useEffect} from 'react'
import {DBContext} from '../../context/DBContext';
import { ethers } from 'ethers';

function MintStableCoins() {
  const {SUSDCBalance, getUserSUSDCBalance,mintUserStableCoins, account} = useContext(DBContext)
  const [amount, setAmount] = useState(null)
  const [loading, setloading] = useState(false)
  useEffect(() => {
    getUserSUSDCBalance()
  
   
  }, [account])

  const handleChange = (e)=>{
    setAmount(e.target.value)
  }

  const mintTokens = async()=> {
    setloading(true)
    await mintUserStableCoins(amount)
    getUserSUSDCBalance()
    setAmount(null)
    setloading(false)
  }
  
  return (
    <VStack minH='70vh' w='full'>
      <VStack w='full' border='1px' p={8} borderRadius='10' borderColor='brand.100'>
        <Text fontSize='lg'>SHINE Stable Coin Balance</Text>
        <Text fontWeight='bold'>{`${ethers.utils.formatEther(SUSDCBalance)} SUSDC`}</Text>
        <VStack w='full' pt={10} spacing={4}>
          <Text>Mint new SUSDC Tokens</Text>
          <Input
          placeholder='Enter the number of SUSDC tokens you want to mint'
          size='lg'
          onChange={handleChange}
          value={amount}
          />
          <Button variant='solid' 
          bg='brand.100'
          isLoading={loading} 
          loadingText='Minting SUSDC' 
          onClick={mintTokens}
          pt={4}
          >Mint SUSDC</Button>

        </VStack>

      </VStack>

    </VStack>
  )
}

export default MintStableCoins