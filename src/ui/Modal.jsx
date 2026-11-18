import { useEffect, useRef } from 'react';
export default function Modal({ title, onClose, children, wide }) {
  const box = useRef();
  useEffect(() => {
    const prev = document.activeElement; box.current.querySelector('h2')?.focus();
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const f = [...box.current.querySelectorAll('button,a[href],input,[tabindex="0"]')].filter((x) => !x.disabled);
        if (!f.length) return; const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} ref={box}>
        <button className="x" onClick={onClose} aria-label="Tutup">✕</button>
        <h2 tabIndex={-1}>{title}</h2>{children}
      </div>
    </div>
  );
}
