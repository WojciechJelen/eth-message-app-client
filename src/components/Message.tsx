import React from "react";
import { Message } from "../interfaces";

interface Props {
  message: Message;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  return (
    <div key={message.content} className="rounded-lg p-6 mt-8 bg-black">
      <div className="text-gray-100">Address: {message.address}</div>
      <div className="text-gray-100 bg-black">
        Time: {message.timestamp.toString()}
      </div>
      <div className="text-gray-100 bg-black">Message: {message.content}</div>
    </div>
  );
};
