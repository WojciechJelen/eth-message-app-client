import { ethers } from "ethers";
import abi from "./utils/MessagePortal.json";

export const getMessageContract = (ethereum: any) => {
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as string;
  const CONTRACT_ABI = abi.abi;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const messagePortalContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    return messagePortalContract;
  } else {
    return null;
  }
};
