import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { nftAddress, marketAddress } from "../config";
import NFT from "../abis/NFT.json";
import Market from "../abis/NFTMarket.json";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateItem = () => {
  const [fileUrl, setFileUrl]: any = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  const router = useRouter();

  const onChange = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received progress update: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (err) {
      console.log(err);
    }
  };

  const createItem = async (e: any) => {
    e.preventDefault();
    const { name, description, price } = formInput;
    console.log(name, description, price);
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    console.log(data + "data");

    try {
      const added = await client.add(data);
      const url: any = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (err) {
      console.log(err);
    }
  };

  const createSale = async (url: any) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(marketAddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, { value: listingPrice });

    await transaction.wait();
    router.push("/");
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Create NFT</h2>

        <form action="#" className="space-y-8">
          <div>
            <label htmlFor="nft" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              NFT Name
            </label>
            <input
              type="text"
              id="nft"
              name="name"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="NFT Name"
              required
              onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              name="description"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Description..."
              onChange={(e) => setFormInput({ ...formInput, description: e.target.value })}
            ></textarea>
          </div>

          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Price in Matic"
              required
              onChange={(e) => setFormInput({ ...formInput, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="asset">
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="asset"
              type="file"
              name="asset"
              onChange={onChange}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
              SVG, PNG, JPG or GIF (MAX. 800x400px).
              {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} alt="nft" />}
            </p>
          </div>

          <button type="submit" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={createItem}>
            Create NFT
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateItem;
