<script>
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { authHandlers } from '../store/store';
</script>

<div class="h-full flex justify-end items-center">
	<div
		class="card w-full variant-soft-primary p-4 md:py-10 max-w-5xl mx-auto text-center flex flex-col md:flex-row justify-center items-center gap-4"
	>
		<p class="!text-xl">Sign in to view your profile:</p>
		<button on:click={authHandlers.loginWithGoogle} class="btn variant-filled flex">
			<span>
				<i class="fa-brands fa-google fa-xl" />
			</span>
			<span> Sign In with Google </span>
		</button>
	</div>
</div>
