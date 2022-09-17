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
</script>

<main>
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
</style>