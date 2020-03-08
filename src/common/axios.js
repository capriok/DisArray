import axios from 'axios';
const KEY = 'AIzaSyANuw6USNNTupLH1nlzhwjHFNJfk19JaOQ';

export const baseParams = {
  part: "snippet",
  maxResults: 5,
  key: KEY
};
export default axios.create({
  baseURL: "http://disarray-leaderboard-server.heropkuapp.com",
  params: baseParams
});