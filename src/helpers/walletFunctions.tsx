// export const AddShineToMetamask = async () => {
//   if (!window || !ethereum) {
//     return alert("No ethereum found");
//   }
//   try {
//     await ethereum.request({
//       // For swiching network if thats already there
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: "0x1AF" }],
//     });
//   } catch (switchError) {
//     // This error code indicates that the chain has not been added to MetaMask.
//     if (switchError.code === 4902) {
//       try {
//         await ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               chainId: "0x1AF",
//               chainName: "SHINE",
//               rpcUrls: ["http://144.126.252.83"],
//             },
//           ],
//         });
//       } catch (addError) {
//         // handle "add" error
//         return alert(`Add error ${addError.message}`);
//       }
//     }
//     // handle other "switch" errors
//     return alert(`other "switch" errors ${switchError}`);
//   }
// };

// export const ConnectWallet = (handleAccountsChanged) => {
//   if (!window || !ethereum) {
//     return;
//   }
//   ethereum
//     .request({ method: "eth_requestAccounts" })
//     .then(handleAccountsChanged)
//     .catch((error) => {
//       if (error.code === 4001) {
//         // EIP-1193 userRejectedRequest error
//         console.log("Please connect to MetaMask.");
//       } else {
//         console.error(error);
//       }
//     });
// };

// Utility funcitn to shorten the url
export const shortenAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
};
