export default function FeaturedSectionSkeleton() {
  return (
    <section style={{ padding: '80px 52px', borderTop: '1px solid var(--border)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div style={{
          width: '200px',
          height: '34px',
          background: 'var(--card)',
          borderRadius: '4px',
        }} />
        <div style={{
          width: '60px',
          height: '14px',
          background: 'var(--card)',
          borderRadius: '4px',
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
      }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              height: '420px',
              background: 'var(--card)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
