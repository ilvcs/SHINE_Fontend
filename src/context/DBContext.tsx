import { useState, useEffect, createContext } from "react";
import { networks } from "../utils/network";
////import { db } from '../firebase'
// import { storage } from "../firebase";
//import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { app, auth, db, functions } from "../firebase/firebaseConfig";
import PINATA_KEYS from "../Pinata/keys";

import { erc721, erc20, nft_marketplace } from "../abi";
import { ethers } from "ethers";

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
  // Whenever the app loads this will fetch
  // account information from the blockchain and
  // save thae data in the state

  useEffect(() => {
    checkIfWalletIsConnected();
    if (network === "Polygon Mumbai Testnet") {
    }
  }, []);

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

    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);
    ethereum.on("chainChanged", handleChainChanged);

    // Refreshes the page when chain id changed
    function handleChainChanged(chainId) {
      window.location.reload();
    }
  };
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
    //let owner = "0xB3b1292ED00c0fB7f308A3bA99ac4537e7AE1D60";
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

  const approveUSDCtoken = async (amount, spender) => {
    const price = ethers.utils.parseEther(amount.toString());
    try {
      const token = getUSDTContract();
      await token.approve(spender, price, {
        gasLimit: "1000000000",
      });
      return true;
    } catch (error) {
      alert(`Can't approve the token ${error.message}`);
      return false;
    }
  };

  const buyMarketplaceNFT = async (marketplaceId) => {
    if (!marketplaceId) {
      return alert("No marketplace id provided ");
    }

    const marketplace = getNFTMarketPlaceContract();
    try {
      const tx = await marketplace.buyNFT(marketplaceId, {
        gasLimit: "1000000000",
      });
      await tx.wait();
      console.log(tx.hash);
      return;
    } catch (error) {
      console.log(`Error is ${error}`);
      return error;
    }
  };

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
        account,
        marketPlaceItems,
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
