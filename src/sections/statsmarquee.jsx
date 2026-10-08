import React from 'react';

const stats = [
  ['100+', 'Screens', 'Designed'],
  ['∞', 'Ideas', null],
  ['05+', 'Digital', 'Experience'],
];

const skills = [
  'UI/UX Design',
  'Product Design',
  'Visual Design',
  'Design Systems',
  'User Experience',
  'Interaction Design',
  'Prototyping',
  'Wireframing',
  'User Testing',
  'User Research',
];

// Alternating tilt + vertical drift so the row reads as
// scattered rather than a rigid line, per the Figma reference.
const pillVariants = [
  { rotate: -2.44, y: 4 },
  { rotate: 2.44, y: -6 },
  { rotate: -1.6, y: 2 },
  { rotate: 1.8, y: -3 },
];

export default function StatsMarquee() {
  return (
    <section className="stats-section">
      <div className="stats-row">
        {stats.map(([number, line1, line2]) => (
          <div className="stat-item" key={number}>
            <span className="stat-number">{number}</span>
            <span className="stat-label">
              {line1}
              {line2 && (
                <>
                  <br />
                  {line2}
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...skills, ...skills].map((skill, i) => {
            const variant = pillVariants[i % pillVariants.length];
            return (
              <span
                className="marquee-pill"
                key={i}
                style={{
                  transform: `rotate(${variant.rotate}deg) translateY(${variant.y}px)`,
                }}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}