import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function OnboardingNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <nav className={`site-nav nav-reveal${isScrolled ? " site-nav--scrolled" : ""}`} aria-label="Primary navigation">
      <div className="nav-brand-links">
        <a className="brand" href="#top" aria-label="NotesRAG home">
          <img src="favicon.png" alt="NotesRAG" className="favicon" />
          <span>NotesRAG</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#trust">Why it’s grounded</a>
          <a href="#start">For students</a>
        </div>
      </div>
      <div className="nav-actions">
        <a className="text-link" href="#start">Sign in</a>
        <a className="button button-primary nav-cta" href="#start">Get started <ArrowUpRight size={15} /></a>
      </div>
    </nav>
  );
}