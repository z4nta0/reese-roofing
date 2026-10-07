import { NavBarCom } from '../../ui/nav.tsx';
import { SitFooCom } from '../../ui/footer.tsx';
import { HerSecCom } from './hero.tsx';
import { SerSecCom } from './services.tsx';
import About from './about';
import Contact from './contact';

export default function Home() {
  return (
    <>
      <NavBarCom />
      <main>
        <HerSecCom />
        <SerSecCom />
        <About />
        <Contact />
      </main>
      <SitFooCom />
    </>
  );
}
