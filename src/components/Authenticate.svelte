<script>
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { authHandlers } from '../store/store';
</script>

<div class="h-full flex justify-center items-center">
	<div class="space-y-5 p-4 card text-token self-center">
		<h1 class="h1 mb-10">Sign In</h1>
		<form>
			<div class="mb-4">
				<label for="email" class="label">
					<span>Email</span>
					<input type="email" id="email" name="email" class="input" />
				</label>
			</div>
			<div class="mb-4">
				<label for="password" >Password</label>
				<input type="password" id="password" name="password" class="input" />
			</div>
			<button type="submit" class="btn variant-filled">Sign In</button>
		</form>
		<hr class="!border-t-2" />
		<button on:click={authHandlers.loginWithGoogle} class="btn variant-filled">
			<span>
				<i class="fa-brands fa-google fa-xl" />
			</span>
			<span> Sign In with Google </span>
		</button>
	</div>
</div>
