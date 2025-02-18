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
        {/* Window controls - now with animation */}
        <circle cx="52" cy="118" r="2.5">
          <animate
            attributeName="fill"
            values="#1877F2;rgba(24,119,242,0.2);#1877F2"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="62" cy="118" r="2.5">
          <animate
            attributeName="fill"
            values="#1877F2;rgba(24,119,242,0.2);#1877F2"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="72" cy="118" r="2.5">
          <animate
            attributeName="fill"
            values="#1877F2;rgba(24,119,242,0.2);#1877F2"
            dur="2s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Function code */}
        <text x="43" y="80" fill="#1877F2" fontSize="12" fontFamily="monospace">func Logic() &#123;</text>
        <text x="48" y="102" fill="#1877F2" fontSize="12" fontFamily="monospace">  println("Gleece")</text>
        <text x="42" y="140" fill="#1877F2" fontSize="12" fontFamily="monospace">&#125;</text>
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
        {/* All LEDs blinking */}
        <circle cx="75" cy="60" r="3">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="75" cy="90" r="3">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle cx="75" cy="120" r="3">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
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
        {/* Main template window */}
        <rect x="50" y="40" width="100" height="120" rx="8" fill="#E8F5FF" stroke="#1877F2" strokeWidth="2"/>
        
        {/* Double curly braces - left side */}
        <path d="M70 70 Q60 70 60 80 L60 95 Q60 100 55 100 Q60 100 60 105 L60 120 Q60 130 70 130" 
              fill="none" stroke="#1877F2" strokeWidth="2"/>
        <path d="M85 70 Q75 70 75 80 L75 95 Q75 100 70 100 Q75 100 75 105 L75 120 Q75 130 85 130" 
              fill="none" stroke="#1877F2" strokeWidth="2"/>

        {/* Double curly braces - right side */}
        <path d="M115 70 Q125 70 125 80 L125 95 Q125 100 130 100 Q125 100 125 105 L125 120 Q125 130 115 130" 
              fill="none" stroke="#1877F2" strokeWidth="2"/>
        <path d="M130 70 Q140 70 140 80 L140 95 Q140 100 145 100 Q140 100 140 105 L140 120 Q140 130 130 130" 
              fill="none" stroke="#1877F2" strokeWidth="2"/>

        {/* Blinking dots - smaller size */}
        <circle cx="93" cy="100" r="2.5">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="100" cy="100" r="2.5">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="107" cy="100" r="2.5">
          <animate
            attributeName="fill"
            values="#1877F2;#E8F5FF;#1877F2"
            dur="2s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
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