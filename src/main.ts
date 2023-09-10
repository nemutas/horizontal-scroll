import 'overlayscrollbars/overlayscrollbars.css'
import Lenis from '@studio-freight/lenis'
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars'
import ScrollTrigger from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

// =============================
// Lenis

const lenis = new Lenis({
	orientation: 'horizontal',
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add(time => {
	lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// =============================
// Overlay Scrollbar

OverlayScrollbars.plugin(ClickScrollPlugin)

OverlayScrollbars(document.body, {
	overflow: { y: 'hidden' },
	scrollbars: { theme: 'os-theme-light', autoHide: 'scroll', clickScroll: true },
})

// =============================

const sections = document.querySelectorAll<HTMLElement>('.section h2')
sections.forEach(sec => {
	const text = sec.innerText
	sec.innerText = ''
	text.split('').forEach(t => {
		t = t === ' ' ? '&nbsp;' : t
		sec.innerHTML += `<span>${t}</span>`
	})
})

sections.forEach(section => {
	const texts = section.querySelectorAll<HTMLElement>('span')
	gsap.set(texts, { y: '80%', clipPath: 'inset(0 0 100% 0)' })
})

function createTextAnimations() {
	sections.forEach(section => {
		const texts = section.querySelectorAll<HTMLElement>('span')
		gsap.to(texts, {
			y: 0,
			clipPath: 'inset(0 0 0% 0)',
			duration: 0.8,
			ease: 'power2.out',
			stagger: 0.03,
			scrollTrigger: {
				trigger: section,
				start: 'left center',
				horizontal: true,
			},
		})
	})
}

function coverAnimation(props?: { delay?: number; timing?: number }) {
	const delay = props?.delay ?? 0
	const timing = props?.timing ?? 1

	lenis.stop()

	return new Promise(resolve => {
		const cover = document.querySelector<HTMLElement>('.cover')!
		const coverText = cover.querySelector<HTMLElement>('p')!

		const tl = gsap.timeline({ delay, defaults: { duration: 1, ease: 'power2.out' } })
		tl.to(coverText, { clipPath: 'inset(100% 0 0 0)' })
		tl.to(cover, { clipPath: 'inset(0 0 100% 0)' }, '<20%')
		tl.eventCallback('onUpdate', () => {
			if (timing < tl.progress() + 0.01) {
				resolve(null)
			}
		})
		tl.eventCallback('onComplete', () => lenis.start())
	})
}

setTimeout(() => {
	window.scrollTo({ left: 0 })
}, 100)

coverAnimation({ delay: 0.7, timing: 0.5 }).then(() => {
	createTextAnimations()
})
