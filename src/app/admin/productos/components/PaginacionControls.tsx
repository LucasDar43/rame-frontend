'use client';

type PaginacionControlsProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function PaginacionControls({
  page,
  totalPages,
  onPrev,
  onNext,
}: PaginacionControlsProps) {
  const isFirstPage = page <= 0;
  const isLastPage = totalPages === 0 || page >= totalPages - 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '18px 20px',
        borderTop: '1px solid var(--border)',
        background: '#ffffff',
      }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstPage}
        style={{
          minWidth: '120px',
          height: '42px',
          border: '1px solid var(--border2)',
          background: '#ffffff',
          color: 'var(--black)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: isFirstPage ? 'not-allowed' : 'pointer',
          opacity: isFirstPage ? 0.5 : 1,
        }}
      >
        Anterior
      </button>

      <span
        style={{
          fontSize: '14px',
          color: 'var(--off-white)',
          textAlign: 'center',
          flex: 1,
        }}
      >
        Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastPage}
        style={{
          minWidth: '120px',
          height: '42px',
          border: 'none',
          background: 'var(--accent)',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 600,
          cursor: isLastPage ? 'not-allowed' : 'pointer',
          opacity: isLastPage ? 0.5 : 1,
        }}
      >
        Siguiente
      </button>
    </div>
  );
}
