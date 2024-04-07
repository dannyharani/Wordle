<script>
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { authHandlers } from '../store/store';
</script>

<main class="flex flex-col items-center justify-center">
	<div class="mt-12">
		<button on:click={authHandlers.loginWithGoogle} class="btn variant-filled">
			<span>
				<i class="fa-brands fa-google fa-xl" />
			</span>
			<span> Sign In with Google </span>
		</button>
	</div>
</main>
