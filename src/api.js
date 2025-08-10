import axios from "axios";

const api = axios.create({ baseURL: "https://api.stackexchange.com/2.3" });

export const fetchItems = async (page) => {
  const response = await api.get(
    `/users?page=${page}&pagesize=50&order=desc&sort=reputation&site=stackoverflow`
  );
  console.log(response);
  return {
    items: response.data.items,
    hasMore: response.data.has_more,
  };
};
