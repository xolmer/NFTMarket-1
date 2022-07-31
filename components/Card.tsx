import React from "react";

const Card = (props) => {
  const image = props.image;
  const price = props.price;
  return (
    <div className="rounded overflow-hidden shadow-lg">
      <div className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.title}</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">{props.description}</p>

        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">{props.price}</span>
          <span className="text-gray-500 dark:text-gray-400">: Matic</span>
        </div>
        <div className="bg-black-300">
          <img src={image} alt="nft" className="object-scale-down h-48 w-96" />
        </div>
        <div className="flex justify-between">
          <div className="p-2 mt-2">
            <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={props.onClick}>
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
