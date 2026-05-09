export default function FeaturedSectionSkeleton() {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-[52px] lg:py-20" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
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

      <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-4">
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
