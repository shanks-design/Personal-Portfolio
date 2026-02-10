import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SelectedWorkSection from '@/components/SelectedWorkSection';
import AboutCanvas from '@/components/AboutCanvas';
import LiveWork from '@/components/LiveWork';
import Experience from '@/components/Experience';
import FunStuff from '@/components/FunStuff';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <SelectedWorkSection />
      <AboutCanvas />
      <LiveWork />
      <Experience />
      <FunStuff />
      <Contact />
    </main>
  );
}
