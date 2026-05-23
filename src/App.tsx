import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { Stats } from '@/components/Stats';
import { Features } from '@/components/Features';
import { Sistema } from '@/components/Sistema';
import { Pricing } from '@/components/Pricing';
import { Commitments } from '@/components/Commitments';
import { CTA } from '@/components/CTA';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { SignupModal } from '@/components/SignupModal';
import { useCursor } from '@/hooks/useCursor';
import { useParticles } from '@/hooks/useParticles';
import { useAOS } from '@/hooks/useAOS';
import {
  useScrollHeader,
  useScrollOrb,
  useActiveNavLink,
  useSmoothAnchors,
} from '@/hooks/useScrollHeader';
import { useCounters } from '@/hooks/useCounters';

export default function App() {
  const [signupOpen, setSignupOpen] = useState(false);

  // Efeitos globais (DOM-first, replicam o script.js original)
  useCursor();
  useParticles();
  useScrollHeader();
  useScrollOrb();
  useActiveNavLink();
  useSmoothAnchors();
  useCounters();
  useAOS();

  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);

  return (
    <>
      <div className="cursor-dot" />
      <div className="cursor-outline" />
      <canvas id="particles-canvas" />

      <Header onSignup={openSignup} />

      <main>
        <Hero onSignup={openSignup} />
        <TrustStrip />
        <Stats />
        <Features />
        <Sistema />
        <Pricing onSignup={openSignup} />
        <Commitments />
        <CTA onSignup={openSignup} />
        <Contact />
      </main>

      <Footer />

      <SignupModal open={signupOpen} onClose={closeSignup} />
    </>
  );
}
