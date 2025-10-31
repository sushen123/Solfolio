
export interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  description: string;
  attributes: {
    key: string;
    value: string;
  }[];
}

export const dummyNFTs: NFT[] = [
  {
    id: "1",
    name: "CryptoPunk #7804",
    collection: "CryptoPunks",
    image: "/placeholder.svg",
    description: "A CryptoPunk with a pipe and a cap.",
    attributes: [
      { key: "Trait", value: "Pipe" },
      { key: "Trait", value: "Cap" },
    ],
  },
  {
    id: "2",
    name: "Bored Ape #8817",
    collection: "Bored Ape Yacht Club",
    image: "/placeholder.svg",
    description: "A Bored Ape with a spinner hat.",
    attributes: [{ key: "Trait", value: "Spinner Hat" }],
  },
  {
    id: "3",
    name: "Azuki #9605",
    collection: "Azuki",
    image: "/placeholder.svg",
    description: "An Azuki with a red background.",
    attributes: [{ key: "Background", value: "Red" }],
  },
  {
    id: "4",
    name: "Doodle #7932",
    collection: "Doodles",
    image: "/placeholder.svg",
    description: "A Doodle with a rainbow background.",
    attributes: [{ key: "Background", value: "Rainbow" }],
  },
];
