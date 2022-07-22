/**
 *  struct MarketItem {
    uint256 marketId;
    uint256 tokenId;
    address seller;
    address owner;
    uint256 price;
    State state;
   }
 */

import { ethers } from "ethers";

export default class MarketItem {
  constructor(data) {
    console.log(
      `The price is : ${data[0]} - ${data[1]}- ${data[2]} - ${data[3]} - price ${data[4]}`
    );
    this.marketId = data[0];
    this.tokenId = data[1];
    this.seller = data[2];
    this.owner = data[3];
    this.price = ethers.utils.formatEther(data[4].toString());
    this.state = data[5] === 0 ? "LISTED" : "SOLD";

    console.log(this.price);
  }
}
