import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import About from '../sections/About';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
