import { useEffect, useRef } from 'react'
import { Zap, BarChart3, MousePointerClick, ShieldCheck, Copy, Smartphone } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Features.css'

// Tell GSAP to use the scroll plugin
gsap.registerPlugin(ScrollTrigger)

// Each feature is one card. Easy to add or edit later.
const FEATURES = [
  {
    icon: Zap,
    title: 'Instant short links',
    text: 'Paste a long URL and get a clean, short link in seconds.',
  },
  {
    icon: MousePointerClick,
    title: 'Click tracking',
    text: 'Every visit to your short link is recorded so you know what gets attention.',
  },
  {
    icon: BarChart3,
    title: 'Analytics dashboard',
    text: 'See total links, total clicks and activity over time in clear charts.',
  },
  {
    icon: Copy,
    title: 'One-click copy',
    text: 'Copy your new short link to the clipboard with a single click.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe by design',
    text: 'Links are validated and unsafe URL types are blocked before saving.',
  },
  {
    icon: Smartphone,
    title: 'Works everywhere',
    text: 'A responsive layout that looks great on phones, tablets and desktops.',
  },
]

function Features() {
  const sectionRef = useRef(null)

  // Scroll animation: cards appear one by one when they come into view
  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.feature-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all', // so the CSS hover effect works normally afterwards
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%', // starts when the grid is near the bottom of the screen
          once: true, // plays only one time
        },
      })
    }, sectionRef)

    return () => mm.revert()
  }, [])

  return (
    <section id="features" className="features" ref={sectionRef}>
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">
            Everything you need to <span className="accent">track your links</span>
          </h2>
          <p className="features-subtitle">
            Simple tools that help you share cleaner links and understand how they perform.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon">
                  <Icon size={22} />
                </span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features