import { useEffect, useRef, useState, useCallback } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState('default'); // default | hover | click
  const isTouch = useRef(false);

  const isInteractive = useCallback((el) => {
    if (!el) return false;
    return el.closest(
      'a, button, [role="button"], input, textarea, select, label, .glass-card, .btn, .sidebar-link, .sidebar-action-btn, .topbar-menu, .modal-close, .link-btn, .social-icon, .project-link-btn, .course-link-btn, [onclick], .nav-link'
    );
  }, []);

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches) {
      isTouch.current = true;
      return;
    }

    let animId;

    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animate = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;
      // Smooth follow with adaptive speed — faster when far away
      const speed = 0.15;
      ringPos.current.x += dx * speed;
      ringPos.current.y += dy * speed;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const onDown = () => setState('click');
    const onUp = () => {
      // Check if cursor is still over an interactive element
      const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
      setState(isInteractive(el) ? 'hover' : 'default');
    };

    const onOver = (e) => {
      if (isInteractive(e.target)) {
        setState('hover');
      }
    };

    const onOut = (e) => {
      // Only reset to default if the related target (element entering) is NOT interactive
      const entering = e.relatedTarget;
      if (!isInteractive(entering)) {
        setState('default');
      }
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [visible, isInteractive]);

  // Don't render on touch-only devices
  if (isTouch.current) return null;

  return (
    <>
      <div ref={dotRef}  className={`c-dot c-dot--${state} ${visible ? 'c-visible' : ''}`} />
      <div ref={ringRef} className={`c-ring c-ring--${state} ${visible ? 'c-visible' : ''}`} />
    </>
  );
}
