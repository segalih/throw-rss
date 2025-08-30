import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();

export const fetchRSS = async (url: string) => {
  try {
    // Coba dengan axios + custom headers
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    return parser.parse(response.data);
  } catch (err) {
    return null;
  }
};  
