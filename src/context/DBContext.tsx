import { useState, useEffect, createContext } from "react";
import { networks } from "../utils/network";
////import { db } from '../firebase'
// import { storage } from "../firebase";
//import { ref, uploadString, getDownloadURL } from 'firebase/storage'
//import { app, auth, db, functions } from "../firebase/firebaseConfig";


import { erc721, erc20, nft_marketplace ,erc20_minter_onDemand} from "../abi";
import { ethers } from "ethers";

// For settign gas price to prevent metamask errors
const GAS_PRICE = 2 * 1e9
const GAS_LIMIT = 1 * 1e9

export const DBContext = createContext();

// class MarketItem {
//   constructor(data) {
//     console.log(typeOf(data));
//     this.marketId = data[0];
//     this.tokenId = data[1];
//     this.seller = data[2];
//     this.owner = data[3];
//     this.price = data[4];
//   }
// }

export const DBContextProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [network, setNetwork] = useState("");
  const [marketPlaceItems, setMarketplaceItems] = useState([]);
  const [SUSDCBalance, setSUSDCBalance] = useState(0)
  // Whenever the app loads this will fetch
  // account information from the blockchain and
  // save thae data in the state

  useEffect(() => {
    // Checks if the wallet connected and 
    // Checks what network has been connected 

    checkIfWalletIsConnected();
    if (network === "Polygon Mumbai Testnet") {
    }
  }, []);

 
  // Checks for the wallet connection
  // If  connected it will get the account
  // and stores in the state
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("Make sure you have metamask");
    } else {
      console.log("WooW We have metamask installed already");
    }
    // check if the app having the access to get accounts
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = ethers.utils.getAddress(accounts[0]);
      console.log(`Found an autharized account ${account}`);
      setAccount(account);
    } else {
      console.log("No autharized account found");
    }
    // Gets the chain id and fetches the 
    // network and adds the network to the state
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);
    ethereum.on("chainChanged", handleChainChanged);

    // Refreshes the page when chain id changed
    function handleChainChanged(chainId) {
      window.location.reload();
    }
  };

  // Method triggerd when we are trying to connect
  // to the wallet 
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert(
          "Get Metamask To connect with the blockchain => https://metamask.io/"
        );
        return;
      }
      // Request wallet accounts access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      //If we got the access we will get this line printed
      console.log(`Connected : ${accounts[0]}`);
      setAccount(accounts[0]);
      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log(`Chain id ${chainId}`);
      setNetwork(networks[chainId]);
      ethereum.on("chainChanged", handleChainChanged);

      // Refreshes the page when chain id changed
      function handleChainChanged(chainId) {
        window.location.reload();
      }
    } catch (error) {
      return alert(`Error connecting to metamask, \n Error: ${error}`);
    }
  };

  // For uploading fiel to Pinata storage
  const uploadFile = async (file, onError) => {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      method: "POST",
      maxContentLength: Infinity,
      headers: {
        //	pinata_api_key: //pinataApiKey,
        //	pinata_secret_api_key: //pinataSecret,
      },
      body: formData,
    };

    try {
      const response = await fetch("pinataApiEndpoint", config);

      const data = await response.json();

      return data.IpfsHash as string;
    } catch (error) {
      onError({ error });
    }
  };

  
/**
 * Get contract methods for each contract
 * Creates contract instences with abi and addresses 
 * and @returns contract instance to interact
 * 
 */
  const getNFTMinterContract = () => {
    const { ethereum } = window;
    if (!window) {
      return console.log("NO ethereum found");
    }
    const { abi, address } = erc721;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    console.log(address);
    const transactionContract = new ethers.Contract(address, abi, signer);
    //console.log(provider, signer, transactionContract)
    return transactionContract;
  };

  const getUSDTContract = () => {
    const { ethereum } = window;
    if (!window) {
      return console.log("NO ethereum found");
    }
    const { abi, address } = erc20;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    console.log(address);
    const erc20Contract = new ethers.Contract(address, abi, signer);
    //console.log(provider, signer, transactionContract)
    return erc20Contract;
  };

  const getNFTMarketPlaceContract = () => {
    const { ethereum } = window;
    if (!window) {
      return console.log("NO ethereum found");
    }
    const { abi, address } = nft_marketplace;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    console.log(address);
    const transactionContract = new ethers.Contract(address, abi, signer);
    //console.log(provider, signer, transactionContract)
    return transactionContract;
  };

  const getERC20_onDemandMinter = () => {
     const { ethereum } = window;
    if (!window) {
      return console.log("NO ethereum found");
    } 
   const { abi, address } =erc20_minter_onDemand
   const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    console.log(address);
    const onDemandMinter = new ethers.Contract(address, abi, signer);
    return onDemandMinter;

  }


  /**
   * For minting erc721 token 
   * @param ipfsUrl : Ipfs URI string for storing
   */
  const mintERC721NFT = async (ipfsUrl: string) => {
    console.log(`The ipfs url is ${ipfsUrl}`);
    const nftMInterContract = getNFTMinterContract();

    try {
      let tx = await nftMInterContract.mintNFT(ipfsUrl);
      const recept = await tx.wait();
      console.log("Done minting nft", recept);
      if (recept.status == 1) {
        console.log(`Hash is ${tx.hash}`);
      }
    } catch (error) {
      console.log("Transaction failed " + error);
    }
  };

  /**
   * Fetches the tokens of the owner 
   * and returns the 
   * @returns arry of tokensids for the owner
   */

  const listTokensOfOwner = async () => {
    console.log(
      "Listing the Tokens of the owner....",
      ethers.utils.getAddress(account)
    );
    const token = getNFTMinterContract();
    //const tokens = ["1", "2", "3", "4", "5", "6"];
    const totalTokens = await token.totalSupply();
    console.log(`Total Supply of the tokens ${totalTokens}`);
    if (!totalTokens || totalTokens <= 0) {
      return [];
    }
    const userTokens = [];
    for (let i = 1; i <= totalTokens; i++) {
      const tokenId = i;
      try {
        const tokenOwner = await token.ownerOf(tokenId);
        console.log("Owner of the token", tokenId, tokenOwner);
        if (tokenOwner === account) {
          userTokens.push(tokenId);
        }
      } catch (error) {}
    }
    console.log("user tokens", userTokens);
    return userTokens;
  };

  /**
   * Fuction that takes nft ids as input and fetches
   * the NFT uris from the contract and returns the
   * nft URIs as output. 
   * @param nftIds Takes NFT ids as an input 
   * @returns token uris for the tokens
   */

  const fetchTokensUri = async (nftIds: [string]) => {
    const token = getNFTMinterContract();
    if (!nftIds || nftIds.length < 1) {
      return [];
    }
    const tokenUris = [];
    try {
      for (let i = 0; i < nftIds.length; i++) {
        const tokenId = nftIds[i];

        const tokenURI = await token.tokenURI(tokenId);
        console.log("uri of the token", tokenId, tokenURI);
        tokenUris.push({ tokenId: nftIds[i], tokenURI });
      }
    } catch (error) {
      console.log("Error getting token URI:", error);
    }
    console.log("tokens uris", tokenUris);
    return tokenUris;
  };
 


  /**
   * For approving NFT before listing the token
   * @param tokenId Id of the token 
   * @returns  true: if the approved and false: if not approved
   */
  const approveNFTForMarketplaceListing = async (tokenId) => {
    if (!tokenId) {
      return alert("Token Id is empty");
    }
    try {
      const token = getNFTMinterContract();
      const { address } = nft_marketplace;
      await token.approve(address, tokenId);
      return true;
    } catch (error) {
      alert(`Can't approve the token ${error}`);
      return false;
    }
  };
/**
 * List the token in the marketplace
 * @param tokenId : token id for the token that want to list 
 * @param price  price in integer
 * @returns null: if listing is successfull, error: if not successfull
 */
  const listTokenForMarket = async (tokenId, price) => {
    console.log(tokenId, price);
    const marketplace = getNFTMarketPlaceContract();
    //const priceInWei = price * 1000000000000000000;
    const priceInWei = ethers.utils.parseEther(price.toString());
    console.log(priceInWei);

    try {
      const tx = await marketplace.listNFT(tokenId, priceInWei);
      await tx.wait();
      console.log(`Transaction successfully went ${tx}`);
      console.log(tx.hash);
      return;
    } catch (error) {
      console.log(`Error is ${error}`);
      return error;
    }
  };

  /**
   * fetches the marketplace items from the market
   * smart contract and returns items that are listed 
   * @returns arry of market items that are listed.
   */

  const fetchMarketplaceItems = async () => {
    const marketplace = getNFTMarketPlaceContract();
    try {
      const items = await marketplace.fetchAllListedItems();
      console.log(`Marketplace items ${JSON.stringify(items)}`);
      return setMarketplaceItems([...items]);
    } catch (error) {
      console.log(error);
      //alert(error);
      return setMarketplaceItems([]);
    }
  };
  /**
   * Approve the stable coin tokens to spend by the marketplace
   * smart contract, so that if the purchase happen, tose tokens 
   * will be transferd to the owner. 
   * @param amount price of the nft
   * @param spender the marketplace contract address
   * @returns true if approved and false if not approved 
   */
  const approveUSDCtoken = async (amount) => {
    const price = ethers.utils.parseEther(amount.toString());
    // NFT marketplace will act as spender for tokens
    const {  address  } = nft_marketplace;
     const marketPleace = ethers.utils.getAddress(address)
     console.log(address , marketPleace);
    try {
      const token = getUSDTContract();
      await token.approve(marketPleace, price, {
        gasPrice: GAS_PRICE,
        //gasLimit: GAS_LIMIT
      });
      return true;
    } catch (error) {
      alert(`Can't approve the token ${error.message}`);
      return false;
    }
  };
  
  /**
   * 
   * @param marketplaceId : The id of the marketplace
   * @returns  null if the process is successfull
   * or error if there is an error
   */
  const buyMarketplaceNFT = async (marketplaceId) => {
    if (!marketplaceId) {
      return alert("No marketplace id provided ");
    }

    const marketplace = getNFTMarketPlaceContract();
    try {
      const tx = await marketplace.buyNFT(marketplaceId, {
        gasPrice: GAS_PRICE,
        gasLimit: GAS_LIMIT,
      });
      await tx.wait();
      console.log(tx.hash);
      return;
    } catch (error) {
      console.log(`Error is ${error}`);
      return error;
    }
  };

  /**
   * on demand Stablecoin Minter
   */

  const getUserSUSDCBalance = async() => {
    if(!account) {
      console.log(`User account address is not defined ${account}`);
      return 
    }
    try {
      const getMinterContract = getERC20_onDemandMinter()
      const userTokens = await getMinterContract.balanceOf(account)
      console.log(`Balance Of the user ${userTokens}`);
      setSUSDCBalance(userTokens) 
    } catch (error) {
      console.log(`Cant get user balance ${error}`);
       setSUSDCBalance(0)
    }
  }

  const mintUserStableCoins= async(amount) => {
    console.log(`Token amount is ${amount}`)

    if(!account) {
      console.log(`User account address is not defined ${account}`);
      return 
    }
    if(!amount || amount < 1){
      return alert('Please enter the number of tokens needs to be minted')
    }
    const getMinterContract = getERC20_onDemandMinter()
    const amountInWei = ethers.utils.parseEther(amount.toString());
    try {
      
      const tx = await getMinterContract.mintForUser(amountInWei,  {
        gasPrice: GAS_PRICE,
        //gasLimit: GAS_LIMIT
      })
      await tx.wait()
      console.log(`Successfully Minted Tokens ${tx.hash}`)
      
    } catch (error) {
      console.log(`Can't able to mint tokens ${error.message}`);
      return alert(`Can't able to mint SUSDC ${error.message}`)
    }

  }

  return (
    <DBContext.Provider
      value={{
        //uploadImageDataToFirestoreAndGetImageUrl,
        checkIfWalletIsConnected,
        connectWallet,
        mintERC721NFT,
        listTokensOfOwner,
        fetchTokensUri,
        approveNFTForMarketplaceListing,
        listTokenForMarket,
        fetchMarketplaceItems,
        buyMarketplaceNFT,
        approveUSDCtoken,
        getUserSUSDCBalance,
        mintUserStableCoins,
        account,
        marketPlaceItems,
        SUSDCBalance,
      }}
    >
      {children}
    </DBContext.Provider>
  );
};

// const switchNetwork = async () => {
// 	if (window.ethereum) {
// 		try {
// 			// Try to switch to the Mumbai testnet
// 			await window.ethereum.request({
// 				method: 'wallet_switchEthereumChain',
// 				params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
// 			});
// 		} catch (error) {
// 			// This error code means that the chain we want has not been added to MetaMask
// 			// In this case we ask the user to add it to their MetaMask
// 			if (error.code === 4902) {
// 				try {
// 					await window.ethereum.request({
// 						method: 'wallet_addEthereumChain',
// 						params: [
// 							{
// 								chainId: '0x13881',
// 								chainName: 'Polygon Mumbai Testnet',
// 								rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
// 								nativeCurrency: {
// 										name: "Mumbai Matic",
// 										symbol: "MATIC",
// 										decimals: 18
// 								},
// 								blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
// 							},
// 						],
// 					});
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			}
// 			console.log(error);
// 		}
// 	} else {
// 		// If window.ethereum is not found then MetaMask is not installed
// 		alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
// 	}
// }
