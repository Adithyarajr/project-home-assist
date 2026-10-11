function Avatar({ name, url, className }) {
  if (url) {
    return <img src={url} alt={name} className={className} />
  }

  const initial = name && name.trim() ? name.trim().charAt(0).toUpperCase() : '?'

  return (
    <div className={`${className} avatar-fallback`} aria-label={name}>
      {initial}
    </div>
  )
}

export default Avatar