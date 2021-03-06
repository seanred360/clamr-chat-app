import { useEffect } from "react";

const EmojiPicker = ({
  showPicker,
  onTogglePicker,
  onCancel,
  onEmojiSelect,
}) => {
  const handleCancel = (e) => {
    if (e.isComposing || e.keyCode === 27) {
      onCancel();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleCancel, false);
    return () => window.removeEventListener("keydown", handleCancel, false);
  }, []);

  const smileys = [
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐คฃ",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐ฅฐ",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐คช",
    "๐คจ",
    "๐ง",
    "๐ค",
    "๐",
    "๐คฉ",
    "๐ฅณ",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "๐",
    "โน๏ธ",
    "๐ฃ",
    "๐",
    "๐ซ",
    "๐ฉ",
    "๐ฅบ",
    "๐ข",
    "๐ญ",
    "๐ค",
    "๐ ",
    "๐ก",
    "๐คฌ",
    "๐คฏ",
    "๐ณ",
    "๐ฅต",
    "๐ฅถ",
    "๐ฑ",
    "๐จ",
    "๐ฐ",
    "๐ฅ",
    "๐",
    "๐ค",
    "๐ค",
    "๐คญ",
    "๐คซ",
    "๐คฅ",
    "๐ถ",
    "๐",
    "๐",
    "๐ฌ",
    "๐",
    "๐ฏ",
    "๐ฆ",
    "๐ง",
    "๐ฎ",
    "๐ฒ",
    "๐ฅฑ",
    "๐ด",
    "๐คค",
    "๐ช",
    "๐ต",
    "๐ค",
    "๐ฅด",
    "๐คข",
    "๐คฎ",
    "๐คง",
    "๐ท",
    "๐ค",
    "๐ค",
    "๐ค",
    "๐ค ",
    "๐",
    "๐ฟ",
    "๐น",
    "๐บ",
    "๐คก",
    "๐ฉ",
    "๐ป",
    "๐",
    "โ ๏ธ",
    "๐ฝ",
    "๐พ",
    "๐ค",
    "๐",
    "๐บ",
    "๐ธ",
    "๐น",
    "๐ป",
    "๐ผ",
    "๐ฝ",
    "๐",
    "๐ฟ",
    "๐พ",
  ];

  if (showPicker == false) return null;
  return (
    <>
      <div className="fixed right-10 bottom-20 z-[100]">
        <div className="relative w-[300px] h-[300px] flex flex-wrap overflow-y-scroll align-center justify-left p-2 rounded-xl bg-white">
          {smileys.map((emoji) => (
            <button
              key={emoji}
              className="text-4xl p-2 hover:bg-gray-400 rounded-xl"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div
        className="fixed w-screen h-screen z-[90]"
        onClick={onTogglePicker}
      ></div>
    </>
  );
};

export default EmojiPicker;
