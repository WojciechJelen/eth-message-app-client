import React from "react";
import { Message } from "../interfaces";

interface Props {
  message: Message;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  return (
    <div
      key={message.content}
      style={{
        backgroundColor: "OldLace",
        marginTop: "16px",
        padding: "8px",
      }}
    >
      <div>Address: {message.address}</div>
      <div>Time: {message.timestamp.toString()}</div>
      <div>Message: {message.content}</div>
    </div>
  );
};
