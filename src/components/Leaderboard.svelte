<script>
  import fetchRank from "../functions/fetchRank.js";

  let show = false;
  let rank = [];

  export const changeShow = () => {
    show = !show;
  }

  export const showValue = () => {
    return show;
  }

  setInterval(async () => {
    if (show) rank = await fetchRank();
  }, 4000);

  const showRank = (rank) => {
    if (rank == 1) return "🥇";
    if (rank == 2) return "🥈";
    if (rank == 3) return "🥉";
    return rank;
  }

  const comma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const tierArr = "🐀🐇🐒🦍🐘🦅🐆🐅🦈🐉";
  const tier = (score, rank) => {
    score = parseInt(score);
    rank = parseInt(rank);
    if (score < 10) return "🐀";
    if (score < 50) return "🐇";
    if (score < 100) return "🐒";
    if (score < 400) return "🦍";
    if (score < 700) return "🐘";
    if (score < 1000) return "🦅";
    if (rank === 1) return "🐉";
    if (rank <= 5) return "🦈";
    if (rank <= 10) return "🐅";
    return "🐆";
  }
</script>

{#if show}
  <div class="leaderboard-container">
    <div class="leaderboard">
      <span class="title fontSize">🏆 Leaderboard</span>
      <span class="close fontSize" on:click={changeShow}>❌</span>
      <div class="ranking">
        <ol class="rank">
          {#each rank as r}
            <li class="school">
              <div class="schoolRank fontSize">{showRank(r.schoolRank)}</div>
              <div class="schoolName fontSize">{r.schoolName}</div>
              <span class="schoolTier fontSize">{tier(r.pop, r.schoolRank)}</span>
              <div class="schoolScore fontSize">{comma(r.pop)}</div>
            </li>
          {:else}
            <li class="loading fontSize">로딩중... ⏳</li>
          {/each}
        </ol>
      </div>
    </div>
  </div>
{/if}

<style>
  .leaderboard-container {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items : center;
  }

  .leaderboard {
    background-color: white;
    width: 80%;
    padding: 1rem;
    height: 80%;
    user-select: none;
    border-radius: 10px;
  }

  .close {
    cursor: pointer;
    float: right;
  }

  .ranking {
    height: 85%;
    margin-top: 30px;
    overflow-y: auto;
  }

  .rank {
    list-style: none;
    padding: 0;
  }

  .school {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }

  .schoolRank {
    box-sizing: inherit;
    cursor: default;
    justify-content: center;
    user-select: none;
    margin-right: 5px;
  }

  .schoolName {
    box-sizing: inherit;
    cursor: default;
    justify-content: center;
    user-select: none;
  }

  .schoolTier {
    box-sizing: inherit;
    cursor: default;
    justify-content: center;
    user-select: none;
  }

  .schoolScore {
    text-align: center;
    box-sizing: inherit;
    cursor: default;
    margin-left: auto;
    user-select: none;
    padding-right: 10px;
  }

  .loading {
    text-align: center;
  }

  .fontSize {
    font-size: 18px;
  }

  @media (max-width: 500px) {
    .fontSize {
      font-size: 15px;
    }
  }
</style>
