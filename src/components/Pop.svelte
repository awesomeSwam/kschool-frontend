<script>
  import { createEventDispatcher } from "svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import tier from "../functions/tier.js";

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
        <span class="schoolTier tierIcon {tier(schoolCount, schoolRank)}">

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

    .tierIcon {
      height: 25px;
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

    .tierIcon {
      height: 22px;
    }
  }

  * {
    user-select: none;
  }


  .tierIcon {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    display: inline-block;
    width: auto;
    height: 30px;
  }

  .bronze {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.5 13L6 3L17 13H10.5Z' fill='%23A86350'/%3E%3Cpath d='M10.5 13L6 3V18L10.5 13Z' fill='%23663228'/%3E%3Cpath d='M6 18V3L17 13H10.5L6 18Z' stroke='%2337221F' stroke-width='1.8'/%3E%3C/svg%3E");
  }

  .silver {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.2717 14.5676C14.4563 15.9394 13.2691 17.021 11.9131 17.6276L9.97272 11.3003L10.7472 4.48078C12.1404 4.45651 13.7761 5.31448 14.7409 6.27787C15.7058 7.24126 16.2863 8.59474 16.3831 10.1068C16.4799 11.6189 16.087 13.1957 15.2717 14.5676Z' fill='%2397928E'/%3E%3Cpath d='M2.12311 10.5356C2.23324 8.91676 2.90237 7.38641 4.01606 6.20632L9.60696 11.0138L12.567 17.5321C11.09 18.2039 8.86356 18.1922 7.29616 17.7725C5.72877 17.3527 4.35588 16.4015 3.41228 15.0814C2.46867 13.7614 2.01298 12.1545 2.12311 10.5356Z' fill='%23616161'/%3E%3Cmask id='path-3-inside-1_1_185' fill='white'%3E%3Cpath d='M3.84315 5.34315C2.5344 6.65189 1.71994 8.37394 1.53852 10.2159C1.35711 12.0578 1.81997 13.9056 2.84824 15.4446C3.87652 16.9835 5.40658 18.1183 7.17772 18.6555C8.94887 19.1928 10.8515 19.0993 12.5615 18.391C14.2714 17.6828 15.6829 16.4035 16.5554 14.7712C17.4279 13.1389 17.7074 11.2546 17.3463 9.43928C16.9852 7.624 16.0059 5.99008 14.5751 4.81592C13.1444 3.64176 11.3508 3 9.5 3L9.5 9.7471C9.78987 9.7471 10.0708 9.84761 10.2948 10.0315C10.5189 10.2154 10.6723 10.4713 10.7288 10.7556C10.7854 11.0399 10.7416 11.335 10.605 11.5906C10.4683 11.8463 10.2473 12.0466 9.97947 12.1575C9.71166 12.2685 9.41369 12.2831 9.1363 12.199C8.85892 12.1148 8.61929 11.9371 8.45825 11.6961C8.29721 11.4551 8.22472 11.1657 8.25313 10.8772C8.28154 10.5887 8.4091 10.319 8.61406 10.1141L3.84315 5.34315Z'/%3E%3C/mask%3E%3Cpath d='M3.84315 5.34315C2.5344 6.65189 1.71994 8.37394 1.53852 10.2159C1.35711 12.0578 1.81997 13.9056 2.84824 15.4446C3.87652 16.9835 5.40658 18.1183 7.17772 18.6555C8.94887 19.1928 10.8515 19.0993 12.5615 18.391C14.2714 17.6828 15.6829 16.4035 16.5554 14.7712C17.4279 13.1389 17.7074 11.2546 17.3463 9.43928C16.9852 7.624 16.0059 5.99008 14.5751 4.81592C13.1444 3.64176 11.3508 3 9.5 3L9.5 9.7471C9.78987 9.7471 10.0708 9.84761 10.2948 10.0315C10.5189 10.2154 10.6723 10.4713 10.7288 10.7556C10.7854 11.0399 10.7416 11.335 10.605 11.5906C10.4683 11.8463 10.2473 12.0466 9.97947 12.1575C9.71166 12.2685 9.41369 12.2831 9.1363 12.199C8.85892 12.1148 8.61929 11.9371 8.45825 11.6961C8.29721 11.4551 8.22472 11.1657 8.25313 10.8772C8.28154 10.5887 8.4091 10.319 8.61406 10.1141L3.84315 5.34315Z' stroke='%2355504B' stroke-width='3.6' mask='url(%23path-3-inside-1_1_185)'/%3E%3Cpath d='M10.5 13L6 3L17 13H10.5Z' fill='%2397928E'/%3E%3Cpath d='M10.5 13L6 3V18L10.5 13Z' fill='%23616161'/%3E%3Cpath d='M6 18V3L17 13H10.5L6 18Z' stroke='%23363434' stroke-width='1.8'/%3E%3C/svg%3E");
  }

  .gold {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.2717 14.5676C14.4563 15.9394 13.2691 17.021 11.9131 17.6276L9.97272 11.3003L10.7472 4.48078C12.1404 4.45651 13.7761 5.31448 14.7409 6.27787C15.7058 7.24126 16.2863 8.59474 16.3831 10.1068C16.4799 11.6189 16.087 13.1957 15.2717 14.5676Z' fill='%23E39921'/%3E%3Cpath d='M2.12311 10.5356C2.23324 8.91676 2.90237 7.38641 4.01606 6.20632L9.60695 11.0138L12.567 17.5321C11.09 18.2039 8.86356 18.1922 7.29616 17.7725C5.72876 17.3527 4.35588 16.4015 3.41227 15.0814C2.46867 13.7614 2.01297 12.1545 2.12311 10.5356Z' fill='%23C57624'/%3E%3Cmask id='path-3-inside-1_2_233' fill='white'%3E%3Cpath d='M3.84315 5.34315C2.5344 6.65189 1.71994 8.37394 1.53852 10.2159C1.35711 12.0578 1.81997 13.9056 2.84824 15.4446C3.87652 16.9835 5.40658 18.1183 7.17772 18.6555C8.94887 19.1928 10.8515 19.0993 12.5615 18.391C14.2714 17.6828 15.6829 16.4035 16.5554 14.7712C17.4279 13.1389 17.7074 11.2546 17.3463 9.43928C16.9852 7.624 16.0059 5.99008 14.5751 4.81592C13.1444 3.64176 11.3508 3 9.5 3L9.5 9.7471C9.78987 9.7471 10.0708 9.84761 10.2948 10.0315C10.5189 10.2154 10.6723 10.4713 10.7288 10.7556C10.7854 11.0399 10.7416 11.335 10.605 11.5906C10.4683 11.8463 10.2473 12.0466 9.97947 12.1575C9.71166 12.2685 9.41369 12.2831 9.1363 12.199C8.85892 12.1148 8.61929 11.9371 8.45825 11.6961C8.29721 11.4551 8.22472 11.1657 8.25313 10.8772C8.28154 10.5887 8.4091 10.319 8.61406 10.1141L3.84315 5.34315Z'/%3E%3C/mask%3E%3Cpath d='M3.84315 5.34315C2.5344 6.65189 1.71994 8.37394 1.53852 10.2159C1.35711 12.0578 1.81997 13.9056 2.84824 15.4446C3.87652 16.9835 5.40658 18.1183 7.17772 18.6555C8.94887 19.1928 10.8515 19.0993 12.5615 18.391C14.2714 17.6828 15.6829 16.4035 16.5554 14.7712C17.4279 13.1389 17.7074 11.2546 17.3463 9.43928C16.9852 7.624 16.0059 5.99008 14.5751 4.81592C13.1444 3.64176 11.3508 3 9.5 3L9.5 9.7471C9.78987 9.7471 10.0708 9.84761 10.2948 10.0315C10.5189 10.2154 10.6723 10.4713 10.7288 10.7556C10.7854 11.0399 10.7416 11.335 10.605 11.5906C10.4683 11.8463 10.2473 12.0466 9.97947 12.1575C9.71166 12.2685 9.41369 12.2831 9.1363 12.199C8.85892 12.1148 8.61929 11.9371 8.45825 11.6961C8.29721 11.4551 8.22472 11.1657 8.25313 10.8772C8.28154 10.5887 8.4091 10.319 8.61406 10.1141L3.84315 5.34315Z' stroke='%238B4700' stroke-width='3.6' mask='url(%23path-3-inside-1_2_233)'/%3E%3Cpath d='M10.5 13L6 3L17 13H10.5Z' fill='%23E39921'/%3E%3Cpath d='M10.5 13L6 3V18L10.5 13Z' fill='%23C57624'/%3E%3Cpath d='M6 18V3L17 13H10.5L6 18Z' stroke='%23573007' stroke-width='1.8'/%3E%3C/svg%3E");
  }

  .platinum {
    background-image: url("data:image/svg+xml,%3Csvg width='35' height='21' viewBox='0 0 35 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 11.3896L17.4018 7.97745L15.4154 14.0235L12.949 12.4689C11.8679 11.8825 11.1446 12.1925 9.82049 12.9296L4 11.3896Z' fill='%2300432F' stroke='%2302301C' stroke-width='1.4'/%3E%3Cpath d='M31.4945 4.9L17.9945 7.9L22.4945 12.4L23.9945 9.9C24.6948 8.88902 25.4803 8.83938 26.9945 8.9L31.4945 4.9Z' fill='%23007F59' stroke='%2302301C' stroke-width='1.4'/%3E%3Cpath d='M19 13L14.5 3L25.5 13H19Z' fill='%23018059'/%3E%3Cpath d='M19 13L14.5 3V18L19 13Z' fill='%2300432F'/%3E%3Cpath d='M14.5 18V3L25.5 13H19L14.5 18Z' stroke='%23002119' stroke-width='1.8'/%3E%3C/svg%3E");
  }

  .diamond {
    background-image: url("data:image/svg+xml,%3Csvg width='35' height='21' viewBox='0 0 35 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 11.3896L17.4018 7.97745L15.4154 14.0235L12.949 12.4689C11.8679 11.8825 11.1446 12.1925 9.82049 12.9296L4 11.3896Z' fill='%2300C9D4' stroke='%2329AAA1' stroke-width='1.4'/%3E%3Cpath d='M31.4945 4.9L17.9945 7.9L22.4945 12.4L23.9945 9.9C24.6948 8.88902 25.4803 8.83938 26.9945 8.9L31.4945 4.9Z' fill='%2347EBFD' stroke='%2329AAA1' stroke-width='1.4'/%3E%3Cpath d='M19 13L14.5 3L25.5 13H19Z' fill='%2347EBFD'/%3E%3Cpath d='M19 13L14.5 3V18L19 13Z' fill='%2300C9D4'/%3E%3Cpath d='M14.5 18V3L25.5 13H19L14.5 18Z' stroke='%23008088' stroke-width='1.8'/%3E%3C/svg%3E");
  }

  .none {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.5 13L6 3L17 13H10.5Z' fill='%23DCDCDC'/%3E%3Cpath d='M10.5 13L6 3V18L10.5 13Z' fill='white'/%3E%3Cpath d='M6 18V3L17 13H10.5L6 18Z' stroke='black' stroke-width='1.8'/%3E%3C/svg%3E%0A");
  }
</style>