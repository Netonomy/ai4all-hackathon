"use client";
import { FC, MouseEventHandler } from "react";
import { ArrowLeft } from "lucide-react";

interface KeyPadItemProps {
  text: string | JSX.Element;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const KeyPadItem: FC<KeyPadItemProps> = ({ text, onClick }) => (
  <div
    className="text-black dark:text-white text-center text-5xl font-normal cursor-pointer"
    onClick={onClick}
  >
    {text}
  </div>
);

const buttons = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "<"],
];

interface KeyPadProps {
  onButtonClick: (text: string) => void;
}

const KeyPad: FC<KeyPadProps> = ({ onButtonClick }) => (
  <div className="flex flex-1 mb-6 flex-col items-center justify-around">
    {buttons.map((row, rowIndex) => (
      <div key={rowIndex} className="flex items-center w-full justify-around">
        {row.map((text) => (
          <KeyPadItem
            key={text}
            text={
              text === "<" ? (
                <ArrowLeft className="w-[23px] stroke-[3px] dark:text-white" />
              ) : (
                text
              )
            }
            onClick={() => onButtonClick(text)}
          />
        ))}
      </div>
    ))}
  </div>
);

export default KeyPad;
