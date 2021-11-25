import React, { useEffect, useState } from "react";

import { getMessageContract } from "./helpers";

import { useWallet } from "./hooks/useWallet";
import { MessageItem } from "./components/Message";
import { Message } from "./interfaces";

import { useContractEvent } from "./hooks/useMessageContract";

import "./styles/output.css";

const { ethereum } = window;

const messagePortalContract = getMessageContract(ethereum);

const App = () => {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [inputValue, setInput] = useState<string>("");
  const { connectWallet, account, loading, error } = useWallet(ethereum);
  const [isMining, setIsMining] = useState<boolean>(false);

  const updateMessages = (from: string, timestamp: string, message: string) => {
    const newMessage: Message = {
      address: from,
      timestamp,
      content: message,
    };
    setAllMessages((prevState) => [...prevState, newMessage]);
  };

  useContractEvent(messagePortalContract, "NewMessage", updateMessages);

  const sendMessage = async (messageContent: string) => {
    try {
      if (messagePortalContract) {
        const messageTxn = await messagePortalContract.sendMessage(
          messageContent,
          { gasLimit: 3000000 }
        );
        console.log(`Mining ${messageTxn.hash}`);
        setIsMining(true);
        await messageTxn.wait();
        console.log(`Mined -- ${messageTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMining(false);
    }
  };

  const getTotalMessagesCount = async () => {
    if (messagePortalContract) {
      const count = await messagePortalContract.getTotalMessages();
      return count.toNumber();
    } else {
      return undefined;
    }
  };

  const getAllMessages = React.useCallback(async () => {
    try {
      if (messagePortalContract) {
        const messages = await messagePortalContract.getAllMessages();
        console.log("Retrieved all messages...", messages);
        const mappedMessages = messages.map((message: any) => {
          return {
            address: message.sender,
            timestamp: new Date(message.timestamp * 1000),
            content: message.message,
          };
        });

        setAllMessages(mappedMessages);
      } else {
        console.warn("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSendButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  useEffect(() => {
    if (loading || error || !account) {
      return;
    }
    getTotalMessagesCount();
    getAllMessages();
  }, [account, loading, error, getAllMessages]);

  return (
    <div className="bg-gray-900 p-20  ">
      <div>
        <h1 className="text-5xl text-white">Decentralized Messaging</h1>
      </div>
      <div className="mt-10">
        <form className="flex">
          <input
            className="border-indygo-400 rounded-lg mr-3 w-8/12"
            onChange={onInputChange}
            value={inputValue}
          />

          {/* <div className="absolute inset-0 bg-pink-600 rounded-lg"></div> */}
          <button
            disabled={isMining}
            className=" relative px-7 bg-black rounded-lg leading-none flex items-center py-3 w-4/12"
            onClick={onSendButtonClick}
            type="button"
          >
            <span className="flex items center space-x-5 text-pink-600 pr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </span>
            <span className="text-indigo-400 ">
              {isMining ? "Mining..." : "Send Message"}
            </span>
          </button>
        </form>

        {!account && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allMessages.map((message) => {
          return (
            <MessageItem
              message={message}
              key={message.content + message.timestamp}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
