import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, marketAddress } from "../config";
import NFT from "../abis/NFT.json";
import NFTMarket from "../abis/NFTMarket.json";
import Card from "../components/Card";

const MyAssets = () => {
  const [nfts, setNfts]: any = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, signer);
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length) return <h1 className="px-20 py-20 text-3xl">You dont have any NFTs</h1>;

  return (
    <div>
      <div className="ml-10 mt-20">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Purchased NFTs</h2>
      </div>
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {nfts.map((nft: any, i: number) => {
          return (
            <div className="flex flex-col items-center justify-center py-2" key={i}>
              <Card title={nft.name} description={nft.description} price={nft.price} image={nft.image} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAssets;
