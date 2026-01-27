import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SocialProof } from '../components/SocialProof';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { ForTeachers } from '../components/ForTeachers';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <ForTeachers />
      <FAQ />
      <Footer />
    </div>
  );
}
