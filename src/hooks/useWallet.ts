import { useEffect, useState } from "react";

export const useWallet = (ethereum: any) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        console.warn("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Request access to the user's wallet
       * Alternativelu can use const "accounts = await ethereum.request({ method: "eth_requestAccounts" });"
       */
      const accounts = await ethereum.enable();

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setAccount(account);
      } else {
        console.warn("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAccount = async () => {
      setError(undefined);
      setLoading(true);
      try {
        if (!ethereum) {
          console.warn("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setAccount(account);
        } else {
          console.log("No account detected, connect your wallet");
        }
      } catch (error) {
        setError((error as Error).message);
      }

      setLoading(false);
    };

    getAccount();
  }, [ethereum]);

  return { account, error, loading, connectWallet };
};
