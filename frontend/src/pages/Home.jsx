import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import RiskPreview from "../components/home/RiskPreview";
import CTA from "../components/home/CTA";
import Problem from "../components/home/Problem";

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <RiskPreview />
        <CTA />
      </main>

      <Footer />
    </>
  );
}

export default Home;