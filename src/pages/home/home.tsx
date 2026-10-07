import Nav from '../../ui/nav';
import Footer from '../../ui/footer';
import Hero from './hero';
import Services from './services';
import About from './about';
import Contact from './contact';

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
