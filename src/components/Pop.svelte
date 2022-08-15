<script>
  import { createEventDispatcher } from "svelte";
  import Leaderboard from "./Leaderboard.svelte";

  export let show;
  export let schoolCode;
  export let schoolName;
  
  const updateTime = 5000;
  
  let token = "";
  let schoolCount = -1;
  let showSchoolCount = -1;
  let totalCount = -1;
  let showTotalCount = -1;
  let schoolRank = -1;
  let count = localStorage.getItem("count") || 0;
  let sendCount = 0;
  let l;
  let secretMode = localStorage.getItem("secretMode") === "true" || false;
  
  
  const changeSecretMode = () => {
    secretMode = !secretMode;
    localStorage.setItem("secretMode", secretMode);
  }
  
  const random = () => Math.floor(Math.random() * 5);

  const pop = () => {
    if (!show) return ;
    
    count++;
    sendCount++;
    localStorage.setItem("count", count);
  }

  document.addEventListener("keydown", (e) => {
    if (!e.repeat) pop();
  });

  document.addEventListener("pointerdown", () => {
    pop();
  });
  
  setInterval(() => {
    if (schoolCode && sendCount && show && !l.showValue()) {
      sendPop();
    }
  }, updateTime);

  $: {
    (show) ?
      setTimeout(() => { sendPop(); }, 0) :
      totalCount = showTotalCount = schoolCount = showSchoolCount = schoolRank = -1;

  }

  const updatePop = (num) => {
    num = parseInt(num);
    if (schoolCount == -1) {
      schoolCount = num;
      showSchoolCount = num;
      return ;
    }
    schoolCount = num;
    
    const deltaCount = schoolCount - showSchoolCount;
    const time = updateTime / deltaCount; 
    const c = setInterval(() => {
      if (showSchoolCount >= schoolCount) {
        clearInterval(c);
        return ;
      }
      showSchoolCount++;
    }, time);
  }

  const updateTotal = (num) => {
    num = parseInt(num);
    if (totalCount == -1) {      
      totalCount = num;
      showTotalCount = num;
      return ;
    }
    totalCount = num;

    const deltaCount = totalCount - showTotalCount;
    const time = updateTime / deltaCount; 
    const c = setInterval(() => {
      if (showTotalCount >= totalCount) {
        clearInterval(c);
        return ;
      }
      showTotalCount++;
    }, time);
  }

  const isNumber = (num) => {
    if (num === null) return false;
    num = parseInt(num);
    if (num < 0) return false;
    return true;
  }

  let toManyReq = false;
  const maxCount = 150;
  const sendPop = async () => {
    if (toManyReq) {
      toManyReq = false;
      return ;
    }

    const sentCount = (sendCount > maxCount)? 150 : sendCount;
    const url = `https://schoolpopserver.herokuapp.com/pop/?count=${sentCount}&token=${token}&schoolCode=${schoolCode}`;
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();

    if (response.status === 201) {
      if (token) sendCount -= sentCount;
      token = data.token;
 
      if (isNumber(data.rank)) schoolRank = data.rank;
      if (isNumber(data.pop)) updatePop(data.pop);
      if (isNumber(data.total)) updateTotal(data.total);
      
      console.log(data);
      return ;
    } 
    
    if (response.status === 429) {
      toManyReq = true;
    }

    token = "";
  }

  const showRank = (rank) => {
    if (rank == 1) return "🥇";
    if (rank == 2) return "🥈";
    if (rank == 3) return "🥉";
    return rank + " 위";
  }

  const comma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const trans = () => {
    return {
      duration: 80,
      css: () => `transform: scale(1.2) rotate(${random() * 5 - 10}deg)`
    };
  }

  const dispatch = createEventDispatcher();
  const resetSchool = () => {
    dispatch("resetSchool");
  }
</script>

{#if show}
  <div class="pop">
    <a class="mainBtn btn-size" href="https://google.com">
      🌐
    </a>
    <div class="searchSchoolBtn btn-size" on:click={resetSchool}>
      🔍
    </div>
    <div class="title">
      <h1>K-SCHOOL</h1>
    </div>
    <div class="school">
      <div class="schoolData">
        <div class="schoolRank fontSize">
          {#if schoolRank > 0}
            {#if secretMode}
              -
            {:else}
              {showRank(schoolRank)}
            {/if}
          {:else}
              ⏳ 
          {/if}
        </div>
        <div class="schoolName fontSize">
          {#if secretMode}
            학교
          {:else}
            {schoolName}
          {/if}
        </div>
        <span class="schoolTier fontSize">
          🌱
        </span>
        <div class="schoolCount fontSize">
          {#if showSchoolCount >= 0}
            {#if secretMode}
              -
            {:else}
              {comma(showSchoolCount)}
            {/if}
          {:else}
            ⏳
          {/if}
        </div>
        <div class="secretMode fontSize" on:click={changeSecretMode}>
          👁️
        </div>
      </div>
    </div>
    {#key count}
      <div class="count" in:trans>
        {comma(count)}
      </div>
    {/key}
    <div class="leaderboard" on:click={() => l.changeShow()}>
      <div class="totalCount fontSize">
        {#if showTotalCount >= 0}
          🌎 {comma(showTotalCount)}
        {:else}
        🌎 ⏳
        {/if}
      </div>
      <div class="showLeaderboard fontSize">
        🏆
      </div>
    </div>
    <Leaderboard bind:this={l}/>
  </div>
{/if}

<style>
  .mainBtn {
    margin: 15px;
    user-select: none;
    cursor: pointer;
    float: left;
    font-size: 30px;
  }

  .searchSchoolBtn {
    margin: 15px;
    user-select: none;
    cursor: pointer;
    float: right;
    font-size: 30px;
  }

  .title {
    display: flex;
    justify-content : center;
  }

  .schoolData {
    margin-top: 20px;
    user-select: none;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  .schoolRank {
    cursor: default;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .schoolTier {
    cursor: default;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .schoolName {
    cursor: default;
    padding: 0 8px;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .schoolCount {
    cursor: default;
    padding: 0 8px;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .secretMode {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
  }

  .count {
    text-align: center;
    box-sizing: inherit;
    cursor: default;
    display: block;
    width: 80%;
    margin: 20px auto;
    justify-content: center;
    user-select: none;

    text-align: center;
    color: #fff;
    -webkit-text-stroke-width: 2.5px;
    -webkit-text-stroke-color: #000;
    font-weight: 1800;
    font-size: 80px;
    word-wrap: break-word;
  }

  .leaderboard {
    cursor: pointer;
    display: flex;
    justify-content: center;
    flex-direction: row;
    position: absolute;
    bottom: 0;
    width: 50%;
    left: 50%;
    transform: translate(-50%, 0);
    margin-bottom: 30px;
  }

  .showLeaderboard {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .totalCount {
    margin-right: 30px;
    display: flex;
    align-items: center;
  }

  .fontSize {
    user-select: none;
    font-size: 30px;
  }

  @media (max-width: 500px) {
    .fontSize {
      font-size: 18px;
    }
    
    .count {
      font-size: 60px;
      -webkit-text-stroke-width: 2px;
    }

    .btn-size {
      margin: 5px;
      font-size: 18px;
    }

    .title {
      font-size: 10px;
    }
  }

  @media (max-width: 260px) {
    .title {
      font-size: 8px;
    }

    .count {
      font-size: 36px;
      -webkit-text-stroke-width: 1.4px;
    }

    .fontSize {
      font-size: 9px;
    }

    .btn-size {
      margin: 2px;
      font-size: 10px;
    }
  }

  * {
    user-select: none;
  }
</style>