
export default function Logo({ size = 28 }) {
  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', fontWeight:800 }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#8E67F0" />
            <stop offset="1" stopColor="#AF87FF" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="url(#g)" />
      </svg>

      <div>
        Sell<span style={{ color:'#7A55E2' }}>Smart</span>
      </div>
    </div>
  );
}
