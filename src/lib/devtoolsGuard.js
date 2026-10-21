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
}
