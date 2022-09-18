const fetchRank = async () => {
  try {
    const url = "https://port-0-kschool-backend-37y7e24l7jiwra5.gksl1.cloudtype.app/leaderboard";
    const response = await fetch(url);
    const data = await response.json();

    if("rank" in data && "length" in data)
      return { rank: data.rank, length: data.length };  
    
    return null;    
  } catch(error) {
    console.error(error);
    return null;
  }
}

module.exports = fetchRank;