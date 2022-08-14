const fetchRank = async () => {
  try {
    const url = "https://schoolpopserver.herokuapp.com/leaderboard";
    const response = await fetch(url);
    const data = await response.json();

    if(!("rank" in data))
      return [];
    
    return data.rank;
  } catch(error) {
    console.error(error);
    return [];
  }
}

module.exports = fetchRank;