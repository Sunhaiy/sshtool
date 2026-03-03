import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import gsap from 'gsap';

export const ThemeBackground: React.FC = () => {
    const { baseThemeId } = useThemeStore();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear previous animations and children
        container.innerHTML = '';
        gsap.killTweensOf(container.childNodes);

        switch (baseThemeId) {
            case 'blossom':
                createBlossomAnimation(container);
                break;
            case 'ocean':
                createOceanAnimation(container);
                break;
            case 'twilight':
            case 'nebula':
                createStarryAnimation(container);
                break;
            case 'cyberpunk':
                createMatrixAnimation(container);
                break;
            case 'amber':
                createCRTAnimation(container);
                break;
            case 'lihua':
            case 'sunset':
                createFloatingDust(container);
                break;
            default:
                // No heavy animation for minimalist themes, maybe just a very subtle pulse
                break;
        }

        return () => {
            // Cleanup on unmount or theme change
            if (container) {
                gsap.killTweensOf(container.childNodes);
                container.innerHTML = '';
            }
        };
    }, [baseThemeId]);

    // --- Animation Implementations ---

    const createBlossomAnimation = (container: HTMLDivElement) => {
        const petalCount = 30;
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'absolute top-[-20px] rounded-bl-full rounded-tr-full rounded-br-sm rounded-tl-sm bg-pink-300/30 w-3 h-3';

            // Random starting positions
            const startX = Math.random() * window.innerWidth;
            const startRotation = Math.random() * 360;

            gsap.set(petal, { x: startX, rotation: startRotation, scale: Math.random() * 0.8 + 0.5 });
            container.appendChild(petal);

            const duration = Math.random() * 10 + 10;

            gsap.to(petal, {
                y: window.innerHeight + 50,
                x: `+=${Math.random() * 200 - 100}`,
                rotation: `+=${Math.random() * 360 + 360}`,
                duration,
                ease: 'none',
                repeat: -1,
                delay: Math.random() * -duration // Start at random points in the animation
            });
        }
    };

    const createOceanAnimation = (container: HTMLDivElement) => {
        const bubbleCount = 40;
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'absolute bottom-[-20px] rounded-full border border-sky-300/20 bg-sky-200/10 pointer-events-none';
            const size = Math.random() * 20 + 5;
            gsap.set(bubble, {
                width: size,
                height: size,
                x: Math.random() * window.innerWidth
            });
            container.appendChild(bubble);

            const duration = Math.random() * 15 + 10;
            gsap.to(bubble, {
                y: -window.innerHeight - 50,
                x: `+=${Math.sin(i) * 100}`, // Gentle wave motion
                duration,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: false,
                delay: Math.random() * -duration
            });
        }
    };

    const createStarryAnimation = (container: HTMLDivElement) => {
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 2 + 1;
            star.className = 'absolute rounded-full bg-white pointer-events-none shadow-[0_0_8px_2px_rgba(255,255,255,0.4)]';
            gsap.set(star, {
                width: size,
                height: size,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 + 0.1
            });
            container.appendChild(star);

            gsap.to(star, {
                opacity: Math.random() * 0.8 + 0.4,
                scale: Math.random() * 1.5 + 1,
                duration: Math.random() * 4 + 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * -5
            });
        }
    };

    const createMatrixAnimation = (container: HTMLDivElement) => {
        // A simplified matrix rain effect using moving text columns
        const columns = Math.floor(window.innerWidth / 20);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

        for (let i = 0; i < columns; i++) {
            // Only create some columns to not overwhelm the DOM
            if (Math.random() > 0.3) continue;

            const drop = document.createElement('div');
            drop.className = 'absolute top-[-100%] text-cyan-500/30 font-mono text-sm leading-none whitespace-pre-wrap translate-x-[-50%] pointer-events-none break-all w-4 text-center';
            gsap.set(drop, { x: i * 20 });

            // Generate random string for this column
            const length = Math.floor(Math.random() * 30 + 10);
            let content = '';
            for (let j = 0; j < length; j++) {
                content += chars[Math.floor(Math.random() * chars.length)] + '\n';
            }
            drop.innerText = content;
            container.appendChild(drop);

            const duration = Math.random() * 10 + 5;
            gsap.to(drop, {
                y: window.innerHeight * 2,
                duration,
                ease: 'none',
                repeat: -1,
                delay: Math.random() * -duration,
                onRepeat: () => {
                    // Change characters on cycle
                    let newContent = '';
                    for (let j = 0; j < length; j++) {
                        newContent += chars[Math.floor(Math.random() * chars.length)] + '\n';
                    }
                    drop.innerText = newContent;
                }
            });
        }
    };

    const createCRTAnimation = (container: HTMLDivElement) => {
        // Static scanlines wrapper
        const scanlines = document.createElement('div');
        scanlines.className = 'absolute inset-0 pointer-events-none mix-blend-overlay opacity-30';
        scanlines.style.backgroundImage = 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))';
        scanlines.style.backgroundSize = '100% 4px, 6px 100%';
        container.appendChild(scanlines);

        // Moving scanline
        const movingLine = document.createElement('div');
        movingLine.className = 'absolute left-0 right-0 h-4 bg-amber-500/10 mix-blend-screen pointer-events-none blur-[2px]';
        container.appendChild(movingLine);

        gsap.fromTo(movingLine,
            { y: -20 },
            {
                y: window.innerHeight + 20,
                duration: 8,
                ease: 'none',
                repeat: -1
            }
        );
    };

    const createFloatingDust = (container: HTMLDivElement) => {
        // Subtle, slow-moving dust particles for warm/soft themes
        const particleCount = 40;
        const isSunset = baseThemeId === 'sunset';
        const bgColor = isSunset ? 'bg-orange-500/10 shadow-[0_0_10px_2px_rgba(249,115,22,0.1)]' : 'bg-primary/5 shadow-[0_0_10px_2px_rgba(var(--primary),0.05)]';

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 4 + 2;
            p.className = `absolute rounded-full ${bgColor} pointer-events-none blur-[1px]`;
            gsap.set(p, {
                width: size,
                height: size,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 + 0.2
            });
            container.appendChild(p);

            gsap.to(p, {
                x: `+=${Math.random() * 100 - 50}`,
                y: `+=${Math.random() * 100 - 50}`,
                opacity: Math.random() * 0.8 + 0.2,
                duration: Math.random() * 10 + 10,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * -10
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 0 }} // Keep it strictly behind everything but the root background
        />
    );
};
