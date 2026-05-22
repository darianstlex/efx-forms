import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// @ts-expect-error - Docusaurus theme component
import ThemedImage from '@theme/ThemedImage';

import styles from './index.module.css';

function HeroSection() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroLogo}>
            <ThemedImage
              alt="efx-forms Logo"
              sources={{
                light: '/efx-forms/img/logo.svg',
                dark: '/efx-forms/img/logo.svg',
              }}
              className={styles.heroLogoImage}
            />
          </div>
          <h1 className={clsx('hero__title', styles.heroTitle)}>efx-forms</h1>
          <p className={clsx('hero__subtitle', styles.heroTagline)}>
            Effector-based React form library
          </p>
          <p className={styles.heroDescription}>
            Build powerful, reactive forms with Effector's state management.
            TypeScript-first, validation-ready, and production-tested.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--primary button--lg', styles.ctaButton)}
              to="/docs/intro"
            >
              Get Started →
            </Link>
            <Link
              className={clsx('button button--secondary button--lg', styles.ctaButton)}
              to="https://github.com/darianstlex/efx-forms"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function InstallationSection() {
  return (
    <section className={styles.installationSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Install in Seconds</h2>
        <div className={styles.codeBlock}>
          <code className={styles.code}>npm install efx-forms</code>
        </div>
        <p className={styles.installationNote}>
          Peer dependencies: <code>react</code>, <code>effector</code>, <code>effector-react</code>, <code>lodash</code>
        </p>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className={clsx('card', styles.featureCard)}>
      <div className="card__header">
        <div className={styles.featureIcon}>{icon}</div>
        <h3 className={styles.featureTitle}>{title}</h3>
      </div>
      <div className="card__body">
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Effector-Powered',
      description: 'Built on Effector\'s reactive state management. Stores, events, and effects for predictable form state.',
      icon: '⚡',
    },
    {
      title: 'TypeScript First',
      description: 'Full TypeScript support with comprehensive types. Catch errors at compile time, not runtime.',
      icon: '🛡️',
    },
    {
      title: 'Smart Validation',
      description: 'Built-in validators (required, email, etc.) with custom validation support. Client-side by default.',
      icon: '✅',
    },
    {
      title: 'Nested Forms',
      description: 'Handle complex nested structures with ease. Array fields, dynamic forms, and conditional rendering.',
      icon: '🧩',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Why efx-forms?</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      // @ts-expect-error - Docusaurus Layout accepts title/description
      title="efx-forms - Effector-based React form library"
      description="Build powerful, reactive forms with Effector's state management. TypeScript-first, validation-ready."
    >
      <HeroSection />
      <InstallationSection />
      <FeaturesSection />
    </Layout>
  );
}
