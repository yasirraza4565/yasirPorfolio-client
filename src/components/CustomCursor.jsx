import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });     // actual mouse position (dot)
  const ring = useRef({ x: 0, y: 0 });     // smoothed ring position

  useEffect(() => {
    // Don't run on touch-only devices
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    // Activate the custom cursor by adding a class to <html>
    document.documentElement.classList.add('has-custom-cursor');

    let raf;

    // ── Mouse Move: snap the dot, record position ─────────────────────
    const onMouseMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left  = e.clientX + 'px';
        dotRef.current.style.top   = e.clientY + 'px';
      }
    };

    // ── Animation loop: smoothly follow ring ──────────────────────────
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top  = ring.current.y + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ── Hover detection ───────────────────────────────────────────────
    const INTERACTIVE =
      'a, button, [role="button"], input, textarea, select, label, ' +
      '.glass-card, .btn, .sidebar-link, .sidebar-action-btn, ' +
      '.topbar-menu, .modal-close, .link-btn, .social-icon, ' +
      '.project-link-btn, .course-link-btn, .nav-link, [onclick]';

    const check = (el) => el && el.closest(INTERACTIVE);

    const onMouseOver = (e) => {
      if (check(e.target)) {
        dotRef.current?.classList.add('is-hover');
        ringRef.current?.classList.add('is-hover');
      }
    };

    const onMouseOut = (e) => {
      // Only leave hover if we're NOT entering another interactive element
      if (!check(e.relatedTarget)) {
        dotRef.current?.classList.remove('is-hover');
        ringRef.current?.classList.remove('is-hover');
      }
    };

    // ── Click feedback ────────────────────────────────────────────────
    const onMouseDown = () => {
      dotRef.current?.classList.add('is-click');
      ringRef.current?.classList.add('is-click');
    };
    const onMouseUp = () => {
      dotRef.current?.classList.remove('is-click');
      ringRef.current?.classList.remove('is-click');
    };

    // ── Hide when mouse leaves window ─────────────────────────────────
    const onMouseLeave = () => {
      dotRef.current?.classList.add('is-hidden');
      ringRef.current?.classList.add('is-hidden');
    };
    const onMouseEnter = () => {
      dotRef.current?.classList.remove('is-hidden');
      ringRef.current?.classList.remove('is-hidden');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []); // empty deps — run once, never re-run

  return (
    <>
      <div ref={dotRef}  className="c-dot" />
      <div ref={ringRef} className="c-ring" />
    </>
  );
}
