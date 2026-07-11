import './index.css';
import './relic.css';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  const name = context.username ?? 'digger';
  return (
    <div className="relic-splash">
      <div className="relic-splash-inner">
        <div className="relic-splash-kicker">DAILY DIG SITE</div>
        <h1 className="relic-splash-title">RELIC</h1>
        <p className="relic-splash-tag">
          Eight digs. One buried legend. Read the ground, follow the warmth,
          and unearth what the community has hidden.
        </p>
        <button
          className="relic-splash-btn"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Start digging
        </button>
        <div className="relic-splash-hello">Welcome, {name}.</div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
