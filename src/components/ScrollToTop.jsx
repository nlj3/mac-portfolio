import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Without this, following a link from halfway down one page lands you halfway
// down the next one. Browsers only restore scroll on real navigations.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
