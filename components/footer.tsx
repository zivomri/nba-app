export function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev'
  const buildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER ?? '—'

  return (
    <footer
      className="mt-auto w-full py-3 px-4 text-center text-sm font-medium"
      style={{
        backgroundColor: '#1e3a5f',
        color: '#d4af37',
      }}
    >
      <span>Version {version}</span>
      <span className="mx-2" aria-hidden>·</span>
      <span>Build {buildNumber}</span>
    </footer>
  )
}
