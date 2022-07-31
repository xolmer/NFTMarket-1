import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

import Card from "../components/Card";

import { nftAddress, marketAddress } from "../config";
import dotenv from "dotenv";

import NFT from "../abis/NFT.json";
import NFTMarket from "../abis/NFTMarket.json";

const Home: NextPage = (props) => {
  const [nfts, setNfts]: any = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const API_URL = process.env.ALCHEMY_API_KEY_URL;
    const provider = new ethers.providers.AlchemyProvider("maticmum", API_URL);
    // const provider = new ethers.providers.AlchemyProvider("rinkeby", API_URL);
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider);
    const data = await marketContract.fetchMarketItems();
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
          sold: i.sold,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  // Buy Nft
  async function buyNft(nft: any) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(marketAddress, NFTMarket.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length) return <h1 className="px-20 py-20 text-3xl">No items in the Market</h1>;

  return (
    <div className="flex h-auto flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center">
        <div className="px-4 max-w-[1600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft: any, i: number) => {
              return (
                <div className="flex flex-col items-center justify-center px-4 py-4" key={i}>
                  <Card title={nft.name} description={nft.description} price={nft.price} image={nft.image} onClick={() => buyNft(nft)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// useEffect(() => {
//   loadNFTs();
// }, []);

// async function loadNFTs() {
//   const provider = new ethers.providers.JsonRpcProvider();
//   const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
//   const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider);

//   console.log(marketContract);

//   const data = await marketContract.fetchMarketItems();
//   console.log(data);

//   const items = await Promise.all(
//     data.map(async (i: any) => {
//       const tokenUri = await nftContract.tokenURI(i.tokenId);
//       const meta = await axios.get(tokenUri);
//       let price = ethers.utils.formatUnits(i.price.toString(), "ether");
//       let item = {
//         price,
//         tokenId: i.tokenId.toNumber(),
//         seller: i.seller,
//         owner: i.owner,
//         image: meta.data.image,
//         name: meta.data.name,
//         description: meta.data.description,
//       };
//       return item;
//     })
//   );
//   setNfts(items);
//   setLoadingState("loaded");
// }

// async function buyNft(nft: any) {

// }
