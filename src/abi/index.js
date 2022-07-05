import ERC721_Minter from "./ERC721_Minter.json";
import ERC20 from "./ERC20.json";
import NFTMarketplace from "./NFTMarketplace.json";
import ERC20_Minter_OnDemand from './ERC20_Minter_OnDemand.json'

export const erc721 = {
  abi: ERC721_Minter.abi,
  address: "0x89eE595079a3445f1981aaDb830CAfBe5B739f8b",
};
export const erc20 = {
  abi: ERC20.abi,
  address: "0x67c5518B7f3ea8397C9C6e98598B8A737B462289",
};
export const nft_marketplace = {
  abi: NFTMarketplace.abi,
  address: "0x9189F01E93D85B3b71551d949e1d76e38D868C07",
};

export const erc20_minter_onDemand = {
  abi: ERC20_Minter_OnDemand.abi,
  address: "0x907Cb90455f47F8E93fCBfEA31C1614A5e49D8B4"
}
