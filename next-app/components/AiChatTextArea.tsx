"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Button } from "./ui/button";
import { Bot, Brain, SendIcon } from "lucide-react";

export default function AiChatTextArea(props: {
  input: string;
  setInput: any;
  disabled: boolean;
  onSend?: any;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [props.input]);

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      const caretPosition = event.target.selectionStart;
      const textBeforeCaret = props.input.substring(0, caretPosition);
      const textAfterCaret = props.input.substring(caretPosition);
      if (props.setInput) {
        props.setInput(textBeforeCaret + "\n" + textAfterCaret);
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (props.onSend) props.onSend();
    }
  };

  return (
    <div className="flex items-center relative w-full bg-white dark:bg-black">
      <Bot className="absolute left-3 bottom-3" />

      <Textarea
        ref={textAreaRef}
        onChange={(e) => {
          if (props.setInput) {
            props.setInput(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
        value={props.input}
        placeholder="Chat with your ai agent..."
        className="shadow-md min-h-[50px] max-h-[200px] pt-[12px] resize-none w-full text-md pr-[52px] pl-[45px]"
        disabled={props.disabled}
      />

      <Button
        disabled={props.disabled}
        variant="outline"
        size="icon"
        className="absolute right-1 bottom-1 border-none"
        onClick={props.onSend}
      >
        <SendIcon />
      </Button>
    </div>
  );
}
