import React, { useEffect, useState } from "react";

import { getMessageContract } from "./helpers";

import { useWallet } from "./hooks/useWallet";
import { MessageItem } from "./components/Message";
import { Message } from "./interfaces";

import "./App.css";
import { useContractEvent } from "./hooks/useMessageContract";

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
            message: message.content,
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
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="weaving hand">
            👋{" "}
          </span>
          Hey there!
        </div>

        <div className="bio">{isMining && <span>Mining...</span>}</div>

        <form>
          <input onChange={onInputChange} value={inputValue} />
          <button
            className="waveButton"
            onClick={onSendButtonClick}
            type="button"
          >
            Send Message
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
