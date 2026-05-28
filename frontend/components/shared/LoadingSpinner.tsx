export default function LoadingSpinner({ size = 20, color = '#4F46E5' }: { size?: number; color?: string }) {
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: size, height: size, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.15)`, borderTopColor: color, animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
