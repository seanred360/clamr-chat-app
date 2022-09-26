import { useEffect } from "react";

const EmojiPicker = ({
  showPicker,
  onTogglePicker,
  onCancel,
  onEmojiSelect,
}) => {
  useEffect(() => {
    const handleCancel = (e) => {
      if (e.isComposing || e.keyCode === 27) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleCancel, false);
    return () => window.removeEventListener("keydown", handleCancel, false);
  }, [onCancel]);

  const smileys = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
  ];

  if (showPicker === false) return null;
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
