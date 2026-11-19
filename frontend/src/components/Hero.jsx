import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Copy, ExternalLink, Link2, Loader2 } from 'lucide-react'
import gsap from 'gsap'
import { shortenUrl } from '../services/api'
import './Hero.css'
import { useToast } from './ToastProvider'

function Hero() {
  const { showToast } = useToast()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null) // { code, shortUrl, originalUrl }
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const heroRef = useRef(null)

  // Page-load animation (skipped if the user prefers reduced motion)
  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(
        ['.hero-badge', '.hero-title', '.hero-subtitle', '.hero-form'],
        {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'all',
        }
      )
    }, heroRef)

    return () => mm.revert()
  }, [])

  // Runs when the form is submitted (button click or Enter key)
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (url.trim() === '') {
      setStatus('error')
      setErrorMessage('Please enter a URL.')
      setResult(null)
      return
    }

    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    setCopied(false)

    try {
      const data = await shortenUrl(url)
      setResult(data)
      setStatus('success')
      showToast('Short link created!')
    } catch (error) {
      setErrorMessage(error.message)
      setStatus('error')
    }
  }

  // Copies the short link to the clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      showToast('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setErrorMessage('Could not copy automatically. Please copy the link by hand.')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="container hero-inner">
        <span className="hero-badge">
          <Link2 size={14} /> Short links with real analytics
        </span>

        <h1 className="hero-title">
          <span className="hero-title-line">Shorten a link.</span>
          <br />
          <span className="hero-title-line hero-title-muted">Track what happens next.</span>
        </h1>

        <p className="hero-subtitle">
          Turn long, messy URLs into clean short links and see how many people
          click them, all from one simple dashboard.
        </p>

        <form className="hero-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="url-input" className="visually-hidden">
            Long URL to shorten
          </label>
          <input
            id="url-input"
            className="hero-input"
            type="text"
            placeholder="Paste your long URL here"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            autoComplete="off"
            disabled={isLoading}
            aria-invalid={status === 'error'}
          />
          <button
            type="submit"
            className="btn btn-primary hero-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spin" /> Shortening...
              </>
            ) : (
              <>
                Shorten URL <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Error message */}
        {status === 'error' && (
          <p className="hero-error" role="alert">
            {errorMessage}
          </p>
        )}

        {/* Success result */}
        {status === 'success' && result && (
          <div className="hero-result" role="status">
            <p className="hero-result-label">Your short link is ready:</p>
            <div className="hero-result-row">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-result-link"
              >
                {result.shortUrl}
                <ExternalLink size={14} />
              </a>
              <button type="button" className="btn hero-copy" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check size={16} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="hero-result-original">Original: {result.originalUrl}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero