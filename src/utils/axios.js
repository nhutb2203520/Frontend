import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000, // 10 giây
});
export default instance;
