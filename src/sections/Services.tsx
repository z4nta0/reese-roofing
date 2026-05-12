import './Services.css';

type Service = {
  id: string;
  title: string;
  description: string;
  details: string[];
};

const services: Service[] = [
  {
    id: '01',
    title: 'Single-ply membrane systems',
    description:
      'Energy-efficient TPO, EPDM, and PVC roofing engineered for flat and low-slope commercial buildings.',
    details: ['TPO installation', 'EPDM rubber roofing', 'PVC membrane systems'],
  },
  {
    id: '02',
    title: 'Metal roofing & retrofits',
    description:
      'Standing-seam and architectural metal roofs that perform for decades — installed new or retrofitted over existing systems.',
    details: ['Standing seam', 'Through-fastened panels', 'Metal-over-metal retrofits'],
  },
  {
    id: '03',
    title: 'Built-up & modified bitumen',
    description:
      'Multi-ply BUR and modified bitumen assemblies for proven, redundant waterproofing on flat commercial roofs.',
    details: ['Hot-applied BUR', 'SBS & APP modified bitumen', 'Cold-applied systems'],
  },
  {
    id: '04',
    title: 'Repair & restoration',
    description:
      'Targeted repairs and full restoration coatings that extend the service life of your existing roof — without a full tear-off.',
    details: ['Leak diagnostics', 'Silicone & acrylic coatings', 'Flashing & seam repair'],
  },
  {
    id: '05',
    title: 'Preventative maintenance',
    description:
      'Scheduled inspection and upkeep programs that catch small issues before they become claims, downtime, or tear-offs.',
    details: ['Bi-annual inspections', 'Drain & gutter clearing', 'Documentation for warranties'],
  },
  {
    id: '06',
    title: 'Storm & emergency response',
    description:
      'Rapid hail and wind damage assessments with direct insurance coordination — and emergency tarping when you need it now.',
    details: ['Storm damage inspections', 'Insurance documentation', '24/7 emergency tarping'],
  },
];

export default function Services() {
  return (
    <section id="services" className="services section">
      <div className="container">
        <div className="services__head">
          <span className="eyebrow">02 — What we do</span>
          <h2 className="display services__title">
            A full range of commercial<br />
            roofing <em>specialties</em>.
          </h2>
          <p className="lede services__lede">
            From new construction to emergency repair, every project starts with an
            on-site assessment and a clear, line-itemed proposal — so you know exactly
            what's being installed and why.
          </p>
        </div>

        <div className="services__grid">
          {services.map((s) => (
            <article key={s.id} className="service">
              <div className="service__head">
                <span className="service__id">{s.id}</span>
                <h3 className="service__title">{s.title}</h3>
              </div>
              <p className="service__desc">{s.description}</p>
              <ul className="service__list">
                {s.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
