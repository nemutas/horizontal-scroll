import { defineConfig } from 'vite'

export default defineConfig(() => {
	return {
		base: '/horizontal-scroll/',
		server: {
			host: true,
		},
	}
})
