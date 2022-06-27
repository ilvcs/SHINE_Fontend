import ERC721_Minter from "./ERC721_Minter.json";
import ERC20 from "./ERC20.json";
import NFTMarketplace from "./NFTMarketplace.json";

export const erc721 = {
  abi: ERC721_Minter.abi,
  address: "0x89eE595079a3445f1981aaDb830CAfBe5B739f8b",
};
export const erc20 = {
  abi: ERC20.abi,
  address: "0xD7b68893cbbE99F2005663AF675fBEeecA2e0Ee7",
};
export const nft_marketplace = {
  abi: NFTMarketplace.abi,
  address: "0xfc8529F6c3BE7b0345aF1bd0fC7d42b5e2cd67d0",
};
