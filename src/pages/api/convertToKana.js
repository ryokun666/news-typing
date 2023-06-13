import axios from "axios";

// ニュース説明をひらがなに変換する非同期関数
export const convertToKana = async (text) => {
  try {
    const response = await axios.post("http://localhost:3001/convert-to-kana", {
      text,
    });
    return response.data.convertedText;
  } catch (error) {
    console.error("Error converting text:", error);
  }
};
