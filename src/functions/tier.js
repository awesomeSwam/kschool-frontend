const tierArr = ["diamond", "platinum", "gold", "silver", "bronze"];
const scrArr = [300e4, 75e4, 25e4, 5e4, 1e4];
const tier = (score, rank) => {
  score = parseInt(score);
  rank = parseInt(rank);
  for (let i = 0; i < scrArr.length; i++)
    if (score >= scrArr[i]) return tierArr[i];
  
  return tierArr[0];
}

module.exports = tier;