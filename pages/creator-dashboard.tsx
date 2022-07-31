import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, marketAddress } from "../config";
import NFT from "../abis/NFT.json";
import NFTMarket from "../abis/NFTMarket.json";
import Card from "../components/Card";

const CreatorDashboard = () => {
  const [nfts, setNfts]: any = useState([]);
  const [sold, setSold]: any = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, signer);
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const data = await marketContract.fetchItemsCreated();

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
          sold: i.sold,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );

    const soldItems = items.filter((i) => i.sold);
    console.log(soldItems.length);
    setSold(soldItems);
    setNfts(items);
    setLoadingState("loaded");
  }
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
      <div className="ml-10 mt-20">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Sold NFTs</h2>
      </div>
      <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {Boolean(sold.length) && (
          <div>
            <div className="flex flex-col justify-center">
              {sold.map((nft: any, i: any) => {
                return (
                  <div className="flex flex-col items-center justify-center py-2" key={i}>
                    <div className="flex flex-col items-center justify-center py-2" key={i}>
                      <Card title={nft.name} description={nft.description} price={nft.price} image={nft.image} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;

//   <section className="bg-white dark:bg-gray-900 ">
//   <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
//     <div className="max-w-screen-md mb-8 lg:mb-16">
//       <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Purchased NFTs</h2>
//     </div>
//     <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
//       <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"></div>
//       {nfts.map((nft: any, i: number) => {
//         return (
//           <div className="flex flex-col items-center justify-center py-2" key={i}>
//             <Card title={nft.name} description={nft.description} price={nft.price} image={nft.image} />
//           </div>
//         );
//       })}
//     </div>
//   </div>
//   <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
//     <div className="max-w-screen-md mb-8 lg:mb-16">
//       <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Sold NFTs</h2>
//     </div>
//     <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
//       <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"></div>
//       {Boolean(sold.length) && (
//         <div>
//           <div className="flex flex-col justify-center">
//             {sold.map((nft: any, i: any) => {
//               return (
//                 <div className="flex flex-col items-center justify-center py-2" key={i}>
//                   <div className="flex flex-col items-center justify-center py-2" key={i}>
//                     <Card title={nft.name} description={nft.description} price={nft.price} image={nft.image} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// </section>
