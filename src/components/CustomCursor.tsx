import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Track links, buttons, interactive elements for hover states
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, [data-hover-glow]'
      );
      
      const onMouseEnter = () => setIsHovered(true);
      const onMouseLeave = () => setIsHovered(false);

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Add hover listeners immediately and also set up a mutation observer to handle dynamically loaded elements
    const cleanupHover = addHoverListeners();
    
    const observer = new MutationObserver(() => {
      cleanupHover();
      addHoverListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cleanupHover();
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        id="custom-cursor-ring"
        style={{
          x: cursorRingX,
          y: cursorRingY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 64 : isClicked ? 16 : 36,
          height: isHovered ? 64 : isClicked ? 16 : 36,
          borderColor: isHovered ? '#ff2a2a' : '#ff5f00',
          backgroundColor: isHovered ? 'rgba(255, 42, 42, 0.05)' : 'rgba(255, 95, 0, 0)',
        }}
        className="fixed top-0 left-0 pointer-events-none rounded-full border border-brand-orange z-50 mix-blend-screen transition-all duration-150 ease-out shadow-[0_0_15px_rgba(255,95,0,0.25)]"
      />

      {/* Inner Dot */}
      <motion.div
        id="custom-cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.5 : isClicked ? 0.6 : 1,
          backgroundColor: isHovered ? '#ff2a2a' : '#ff5f00',
        }}
        className="fixed top-0 left-0 w-2.5 h-2.5 pointer-events-none rounded-full bg-brand-orange z-50 shadow-[0_0_8px_rgba(255,95,0,0.8)]"
      />
    </>
  );
}
