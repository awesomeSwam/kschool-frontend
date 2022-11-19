<script>
  import fetchSchool from "../functions/fetchSchool.js";
  import { createEventDispatcher } from 'svelte';
  import App from "../App.svelte";
  const dispatch = createEventDispatcher();

  export let show;
  let schoolName = "";
  let schools = [];
  let loading = false;

  const getSchool = async () => {
    if (!loading) {
      loading = true;
      schools = await fetchSchool(schoolName);
      loading = false;
    }
  }

  const passSchool = (schoolName, schoolCode) => {
    dispatch("school", {
      schoolName, schoolCode
    });
  }

  const inputKeyPress = (event) => {
    if (event.charCode === 13) {
      getSchool();
    }
  }

  const openJo = () => {
    window.open("https://www.youtube.com/c/%EC%A1%B0%EC%BD%94%EB%94%A9JoCoding").focus();
  }
</script>

{#if show}
  <div class="findSchool">
    <div class="title">
      <h1>K-SCHOOL</h1> <img class="jo" src="../img.png" draggable="false" on:click={openJo} alt="">
    </div>
    <div class="input">
      <input type="text" placeholder="학교를 검색해주세요." class="schoolName-input" bind:value={schoolName} on:keypress={inputKeyPress}/>
      <button class="search" on:click={getSchool}>🔍</button>
    </div>
    <div class="output">
      {#if loading}
        <div class="none">로딩중... ⏳</div>
      {:else}
        {#each schools as {schoolCode, schoolName, schoolAddress}}
          <div class="school" on:click={() => {passSchool(schoolName, schoolCode);}}>
            <div class="schoolName">{schoolName}</div>
            <div class="schoolAddress">{schoolAddress}</div>
          </div>
        {:else}
          <div class="none">검색 결과가 없습니다.</div>
          <div class="none">자신의 학교가 검색되지 않을 경우<br>awesomeGolang@gmail.com 으로 연락주세요.</div>
        {/each}
      {/if}
    </div>
    <!-- <div class="ad">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5824103033592509"
      crossorigin="anonymous"></script>
      <ins class="adsbygoogle"
        style="display:inline-block;width:240px;height:240px"
        data-ad-client="ca-pub-5824103033592509"
        data-ad-slot="1840518795"></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>   -->
  </div>
{/if}

<style>
  .ad {
    margin: 0 auto;
  }

  .findSchool {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
    justify-content : center;
  }

  .input {
    height: 50px;
    display: flex;
    margin: 0 auto;
    width: 80%;
  }

  .schoolName-input {
    height: inherit;
    display: grid;
    width: 80%;
    padding-left: 20px;
    margin: 0 auto;
    border-radius: 10px;
    font-size: 20px;
  }

  .search {
    background-color: transparent;
    cursor: pointer;
    display: block;
    border: 0;
    padding: 0;
    margin: 0;
    font-size: 30px;
  }

  .output {
    display: flex;
    flex-direction: column;
    margin: 40px auto;
    max-width: 800px;
    height: 80%;
    width: 100%;
    font-size: 20px;
    overflow: auto;
  }

  .output .none {
    display: flex;
    margin: 20px auto;
    text-align: center;
  }

  .school {
    display: flex;
    flex-direction: column;
    margin: 4px auto;
    border: 1px solid #ddd;
    border-radius: 100px;
    cursor: pointer;
    width: 80%;
  }

  .school:hover {
    border-color: #bbb;
  }

  .schoolName {
    margin-top: 2px;
    text-align: center;
  }

  .schoolAddress {
    margin-bottom: 2px;
    text-align: center;
  }

  .jo {
    cursor: pointer;
    user-select: none;
    width: 100px;
    height: 100px;
  }

  @media (max-width: 500px) {
    .title {
      font-size: 10px;
    }

    .output {
      font-size: 16px;
    }

    .schoolName-input {
      font-size: 16px;
    }

    .input {
      height: 40px;
    }

    .search {
      font-size: 20px;
    }

    .jo {
      width: 45px;
      height: 45px;
    }
  }

  @media (max-width: 300px) {
    .title {
      font-size: 8px;
    }

    .output {
      font-size: 12px;
    }

    .schoolName-input {
      padding-left: 8px;
      font-size: 14px;
    }

    .input {
      font-size: 33px;
    }

    .search {
      font-size: 18px;
    }

    .jo {
      width: 35px;
      height: 35px;
    }
  }
</style>