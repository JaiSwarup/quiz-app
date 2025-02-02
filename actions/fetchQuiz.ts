"use server";

import axios from "axios";

export default async function fetchQuiz() {
  try {
    const res = await axios.get("https://api.jsonserve.com/Uw5CrX");
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
