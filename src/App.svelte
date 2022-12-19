<script>
	import FindSchool from "./components/FindSchool.svelte";
	import Pop from "./components/Pop.svelte";

	let schoolName = localStorage.getItem("schoolName") || "";
	let schoolCode = localStorage.getItem("schoolCode") || "";
	let showBool = !Boolean(schoolName && schoolCode);
	
	const saveSchool = (event) => {
		const { schoolName: name, schoolCode: code } = event.detail;
		schoolName = name;
		schoolCode = code;
		showBool = false;

		localStorage.setItem("schoolName", name);
		localStorage.setItem("schoolCode", code);
	}

	const resetSchool = () => {
		showBool = true;
	}

  const openJo = () => {
    window.open("https://www.youtube.com/@jocoding").focus();
  }

  const openEventLink = () => {
    window.open("https://www.youtube.com/watch?v=yBW1HdjRGww").focus();
  }

  const openTwitterLink = () => {
    window.open("https://twitter.com/_awesome_dream");
  }

	let alertShow = true;

</script>

<main>
	<FindSchool show={showBool} on:school={saveSchool}/>
	<Pop show={!showBool} schoolCode={schoolCode} schoolName={schoolName} on:resetSchool={resetSchool}/>
	{#if alertShow}
		<div class="alert-container">
			<div class="alert">
				<span class="title fontSize">이벤트 알림</span>
				<span class="close fontSize" on:click={() => alertShow = false}>❌</span>
				<div class="something">Test
          <!-- 학교 간식차 이벤트 실제로 진행하겠습니다.
          <br>
          클릭 수 랭킹 1위 학교에 전교생을 위한 간식차를 보내드리겠습니다.
          <br>
          이벤트 기간 : 2022년 12월 19일 (월) ~ 2023년 3월 15일 (수) 12시 기준
          <br>
          <br>
          간식차비는 <a class="link" on:click={openJo}>조코딩</a>님께서 지원해주신다고 하셨습니다.
          <br>
          유언비어를 현실화시켜주신 <a class="link" on:click={openJo}>조코딩</a>님께 감사드립니다.
          <br>
          자세한 내용은 밑에 있는 링크들을 확인해주세요.
          <a class="link" on:click={openEventLink}>https://www.youtube.com/@jocoding</a>
          <br>
          <a class="link" on:click={openTwitterLink}>https://twitter.com/_awesome_dream</a> -->
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	@font-face {
    font-family: 'ONE-Mobile-POP';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-POP.woff') format('woff');
    font-weight: normal;
    font-style: normal;
	}
	* {
		font-family: 'ONE-Mobile-POP';
		font-size: 20px
	}
	.alert-container {
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

  .alert {
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

  .something {
    margin-top: 30px;
  }

  .fontSize {
    font-size: 20px;
  }
  
  @media (max-width: 500px) {
    .fontSize {
      font-size: 17px;
    }
  }

  .link {
    cursor: pointer;
  }
</style>