import { NavBarCom } from '../../ui/nav.tsx';
import { SitFooCom } from '../../ui/footer.tsx';
import { HerSecCom } from './hero.tsx';
import { SerSecCom } from './services.tsx';
import { AboSecCom } from './about.tsx';
import Contact from './contact';

export default function Home() {
  return (
    <>
      <NavBarCom />
      <main>
        <HerSecCom />
        <SerSecCom />
        <AboSecCom />
        <Contact />
      </main>
      <SitFooCom />
    </>
  );
}
