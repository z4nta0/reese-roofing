import { NavBarCom } from '../../ui/nav.tsx';
import { SitFooCom } from '../../ui/footer.tsx';
import Hero from './hero';
import Services from './services';
import About from './about';
import Contact from './contact';

export default function Home() {
  return (
    <>
      <NavBarCom />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <SitFooCom />
    </>
  );
}
