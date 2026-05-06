import axios from "axios";
const base_url = 'https://youtube-v31.p.rapidapi.com/search';
export const options = {
  params: {
    maxResults: "51",
  },
  headers: {
    "X-RapidAPI-Key": '020506020bmshcaea3aef927d776p1500e9jsn1460e03de818',
    "X-RapidAPI-Host": 'youtube-v31.p.rapidapi.com',
  },
};

const fetchApi = async (url) => {
  try {
    const { data } = await axios.get(`${base_url}/${url}`, options);
    return data;
  } catch (error) {
    console.log("error in fetch api");
  }
};
export default fetchApi;
