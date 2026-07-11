import { reddit, context } from '@devvit/web/server';

function prettyDate(d = new Date()): string {
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export const createPost = async () => {
  const { subredditName } = context;
  const title = `⛏️ RELIC — Dig Site, ${prettyDate()}`;
  return await reddit.submitCustomPost({
    title,
    ...(subredditName ? { subredditName } : {}),
    entry: 'default',
    splash: {
      appDisplayName: 'RELIC',
      backgroundColor: '#14100b',
      buttonLabel: 'Start digging',
      description: "Eight digs. One buried legend. What will you unearth today?",
    },
  });
};
