import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Focus on Your Logic',
    Svg: () => (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Code editor window */}
        <rect x="30" y="40" width="140" height="120" rx="8" fill="#E8F5FF" stroke="#1877F2" strokeWidth="2"/>
        {/* Window controls */}
        <circle cx="45" cy="55" r="3" fill="#1877F2" opacity="0.5"/>
        <circle cx="55" cy="55" r="3" fill="#1877F2" opacity="0.5"/>
        <circle cx="65" cy="55" r="3" fill="#1877F2" opacity="0.5"/>
        {/* Function code */}
        <text x="43" y="95" fill="#1877F2" fontSize="12" fontFamily="monospace">func myLogic() &#123;</text>
        <text x="48" y="115" fill="#1877F2" fontSize="12" fontFamily="monospace">  println("Gleece")</text>
        <text x="43" y="135" fill="#1877F2" fontSize="12" fontFamily="monospace">&#125;</text>
      </svg>
    ),
    description: (
      <>
        Gleece is designed to let you focus on implementing the core logic of your APIs while we handle the rest: documentation, validation, authorization, and more.
      </>
    ),
  },
  {
    title: 'No Magic at Runtime',
    Svg: () => (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Server rack */}
        <rect x="60" y="40" width="80" height="120" rx="4" fill="#E8F5FF" stroke="#1877F2" strokeWidth="2"/>
        {/* Server units */}
        <rect x="65" y="50" width="70" height="20" rx="2" fill="white" stroke="#1877F2" strokeWidth="2"/>
        <rect x="65" y="80" width="70" height="20" rx="2" fill="white" stroke="#1877F2" strokeWidth="2"/>
        <rect x="65" y="110" width="70" height="20" rx="2" fill="white" stroke="#1877F2" strokeWidth="2"/>
        {/* Blinking LED - using animation */}
        <circle cx="75" cy="60" r="3">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Status LEDs */}
        <circle cx="75" cy="90" r="3" fill="#1877F2"/>
        <circle cx="75" cy="120" r="3" fill="#1877F2"/>
        {/* Ventilation holes */}
        <line x1="120" y1="55" x2="130" y2="55" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="60" x2="130" y2="60" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="65" x2="130" y2="65" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="85" x2="130" y2="85" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="90" x2="130" y2="90" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="95" x2="130" y2="95" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="115" x2="130" y2="115" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="120" x2="130" y2="120" stroke="#1877F2" strokeWidth="1"/>
        <line x1="120" y1="125" x2="130" y2="125" stroke="#1877F2" strokeWidth="1"/>
      </svg>
    ),
    description: (
      <>
        Gleece does all the heavy lifting by generating routes at build-time.
        <br/>
        Once generated, the routes are simple, human-readable, and behave exactly like manually written routes in your codebase.
      </>
    ),
  },
  {
    title: 'Built For Customization',
    Svg: () => (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Template customization visualization */}
        <rect x="40" y="40" width="120" height="120" rx="8" fill="#E8F5FF" />
        {/* Template structure */}
        <path d="M60 60H140M60 80H120M60 100H130" stroke="#1877F2" strokeWidth="4" strokeLinecap="round" />
        {/* Customization controls */}
        <circle cx="140" cy="140" r="15" fill="#1877F2" />
        <circle cx="100" cy="140" r="15" fill="#1877F2" opacity="0.6" />
        <circle cx="60" cy="140" r="15" fill="#1877F2" opacity="0.3" />
        {/* Edit pencil icon */}
        <path d="M135 135L145 145M145 135L135 145" stroke="white" strokeWidth="2" />
      </svg>
    ),
    description: (
      <>
        Gleece was built for customization. You can override the default templates used to generate the routes, and adjust Gleece to meet your exact needs.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}