// app/components/Navbar.tsx

import { Link } from "react-router";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
    const navbarRef = useRef<HTMLElement | null>(null);
    const logoRef = useRef<HTMLAnchorElement | null>(null);
    const uploadButtonRef = useRef<HTMLAnchorElement | null>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Initial Navbar entrance animation
        tl.fromTo(
            navbarRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
            logoRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6 },
            "<0.2" // Start 0.2 seconds after the navbar animation begins
        )
        .fromTo(
            uploadButtonRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.6 },
            "<" // Start at the same time as the logo animation
        );

        // --- Interactive Animations (Hover Effects) ---

        // HIRELYZER Logo Hover Effect
        gsap.to(logoRef.current, {
            scale: 1.05,
            color: '#8A2BE2', // Change text color on hover (example purple)
            duration: 0.3,
            ease: "power1.out",
            paused: true, // Animation starts paused
            onComplete: () => { gsap.to(logoRef.current, { scale: 1, color: '#FFFFFF', duration: 0.3, ease: "power1.out" }); } // Reset on reverse
        });

        if (logoRef.current) {
            logoRef.current.addEventListener('mouseenter', () => {
                gsap.to(logoRef.current, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" }); // Bounce on hover
            });

            logoRef.current.addEventListener('mouseleave', () => {
                gsap.to(logoRef.current, { scale: 1, duration: 0.3, ease: "power1.out" });
            });
        }


        // "Upload Resume" Button Hover Effect
        const uploadButton = uploadButtonRef.current;
        if (uploadButton) { // Ensure button exists before adding event listeners
            uploadButton.addEventListener('mouseenter', () => {
                gsap.to(uploadButton, {
                    scale: 1.05,
                    boxShadow: '0px 0px 15px rgba(138, 43, 226, 0.6)', // Glow effect
                    y: -2, // Slight lift
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            uploadButton.addEventListener('mouseleave', () => {
                gsap.to(uploadButton, {
                    scale: 1,
                    boxShadow: 'none', // Remove glow
                    y: 0, // Return to original position
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }

    }, []); // Empty dependency array means this runs once on mount

    return (
        <nav className="navbar" ref={navbarRef}>
            <Link to="/" ref={logoRef}>
                {/* Ensure your p tag has a defined text color in CSS for the hover color to be noticeable */}
                <p className="text-2xl font-bold text-gradient">HIRELYZER</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit" ref={uploadButtonRef}>
                Upload Resume
            </Link>
        </nav>
    );
}

export default Navbar;