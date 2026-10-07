import { NavBarCom } from '../../ui/nav.tsx';
import { SitFooCom } from '../../ui/footer.tsx';
import { HerSecCom } from './hero.tsx';
import Services from './services';
import About from './about';
import Contact from './contact';

export default function Home() {
  return (
    <>
      <NavBarCom />
      <main>
        <HerSecCom />
        <Services />
        <About />
        <Contact />
      </main>
      <SitFooCom />
    </>
  );
}
