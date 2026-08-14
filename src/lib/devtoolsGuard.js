let devToolsOpen = false

const checkDevTools = () => {
  const threshold = 160
  const widthGap = window.outerWidth - window.innerWidth > threshold
  const heightGap = window.outerHeight - window.innerHeight > threshold
  if (widthGap || heightGap) {
    devToolsOpen = true
  }
}

export const initDevToolsGuard = () => {
  const blockKeys = (e) => {
    const key = e.key || ''
    if (
      (e.ctrlKey && ['u', 's', 'c', 'a'].includes(key.toLowerCase())) ||
      key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key.toLowerCase()))
    ) {
      e.preventDefault()
      return false
    }
  }

  window.addEventListener('keydown', blockKeys)
  window.addEventListener('resize', checkDevTools)
  setInterval(checkDevTools, 1000)
}

export const isDevToolsOpen = () => devToolsOpen
