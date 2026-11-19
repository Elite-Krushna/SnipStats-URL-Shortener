import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import './LinksTable.css'
import { useToast } from './ToastProvider'

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function LinksTable({ links }) {
  // Remembers which short code was just copied
  const { showToast } = useToast()
  const [copiedCode, setCopiedCode] = useState(null)

  const handleCopy = async (link) => {
    try {
      await navigator.clipboard.writeText(link.shortUrl)
      setCopiedCode(link.code)
      showToast('Link copied to clipboard')
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      // Clipboard can be blocked by the browser; nothing else to do here
      showToast('Could not copy. Please copy the link by hand.', 'error')
    }
  }

  return (
    <div className="links-table-wrap">
      <table className="links-table">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Created</th>
            <th className="num">Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.code}>
              <td className="short-cell">{link.shortUrl}</td>
              <td className="original-cell" title={link.originalUrl}>
                {link.originalUrl}
              </td>
              <td className="date-cell">{formatDate(link.createdAt)}</td>
              <td className="num">{link.clicks}</td>
              <td>
                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleCopy(link)}
                    aria-label={`Copy ${link.shortUrl}`}
                    title="Copy short link"
                  >
                    {copiedCode === link.code ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <a
                    className="icon-btn"
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${link.shortUrl} in a new tab`}
                    title="Open link (counts as a click)"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LinksTable