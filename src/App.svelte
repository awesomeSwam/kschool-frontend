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

	let alertShow = true;
</script>

<main>
	{#if alertShow}
		<div class="alert-container">
			<div class="alert">
				<span class="title fontSize"></span>
				<span class="close fontSize" on:click={() => alertShow = false}>❌</span>
				<div class="something">
					안녕하세요.
				</div>
			</div>
		</div>
	{/if}
	<FindSchool show={showBool} on:school={saveSchool}/>
	<Pop show={!showBool} schoolCode={schoolCode} schoolName={schoolName} on:resetSchool={resetSchool}/>
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
    height: 85%;
    margin-top: 30px;
    overflow-y: auto;
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