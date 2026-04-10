interface AnalyticsPayload {
  path?: string;
  referrer?: string;
  source?: string;
}

export async function recordEvent(event_type: string, payload: AnalyticsPayload = {}) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type, ...payload }),
    });
  } catch (error) {
    console.warn('Analytics record failed', error);
  }
}
