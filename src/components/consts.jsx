export const BLACK = "#000000";
export const GREEN = "#81c4bfff";
export const DARK_GREEN = "#063f3aff";
export const LIGHT_GREEN = "#0eeeb6ff";
export const RED = "#d62525ff";
export const WHITE = "#ffffff";

export const CHAT_USER_COLOR = WHITE;
export const CHAT_AI_COLOR = WHITE;

export function customScrollBar(color = LIGHT_GREEN) {
  return {
    "&::-webkit-scrollbar": {
      width: "0.4em",
      height: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      width: "0.6em",
      height: "0.6em",
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: color,
      borderRadius: 20,
    },
  };
}

export const costInCentPerInputToken = {
  "gpt-4o": 0.0002379,
};

export const costInCentPerOutputToken = {
  "gpt-4o": 0.0009518,
};
