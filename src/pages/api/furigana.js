// pages/api/furigana.js

import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const APPID = "dj00aiZpPVFPYTd6cDlreVJNSSZzPWNvbnN1bWVyc2VjcmV0Jng9ZDg-";
    const URL = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana";

    const headers = {
      "Content-Type": "application/json",
      "User-Agent": `Yahoo AppID: ${APPID}`,
    };

    const paramDic = {
      id: "1234-1",
      jsonrpc: "2.0",
      method: "jlp.furiganaservice.furigana",
      params: {
        q: req.body.query,
        grade: 1,
      },
    };

    try {
      const response = await axios.post(URL, paramDic, { headers });
      res.status(200).json(response.data);
      return response.data;
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" }); // 405 Method Not Allowed
  }
}
