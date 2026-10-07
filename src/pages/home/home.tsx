import { NavBarCom } from '../../ui/nav.tsx';
import { SitFooCom } from '../../ui/footer.tsx';
import { HerSecCom } from './hero.tsx';
import { SerSecCom } from './services.tsx';
import { AboSecCom } from './about.tsx';
import { ConSecCom } from './contact.tsx';

export default function Home() {
  return (
    <>
      <NavBarCom />
      <main>
        <HerSecCom />
        <SerSecCom />
        <AboSecCom />
        <ConSecCom />
      </main>
      <SitFooCom />
    </>
  );
}
