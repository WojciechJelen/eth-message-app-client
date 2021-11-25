import { Contract } from "@ethersproject/contracts";
import { useEffect } from "react";

export const useContractEvent = (
  contract: Contract | undefined | null,
  eventName: string,
  handler: (...args: any[]) => void
) => {
  useEffect(() => {
    if (contract) {
      contract.on(eventName, handler);
    }
    return () => {
      if (contract) {
        contract.off(eventName, handler);
      }
    };
  }, [contract, eventName, handler]);
};
