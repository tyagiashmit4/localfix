import Pusher from 'pusher';

let pusherInstance: Pusher | null = null;

export function getPusherInstance() {
  if (pusherInstance) return pusherInstance;

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (appId && key && secret && cluster) {
    pusherInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
    return pusherInstance;
  }

  return null;
}

export async function triggerPusherEvent(channel: string, event: string, data: unknown) {
  try {
    const pusher = getPusherInstance();
    if (pusher) {
      await pusher.trigger(channel, event, data);
      console.log(`[Pusher] Successfully dispatched event "${event}" on channel "${channel}"`);
      return true;
    } else {
      console.log(`[Pusher Simulator] Event "${event}" simulated on channel "${channel}":`, data);
      return false;
    }
  } catch (err) {
    console.error('[Pusher] Error triggering event:', err);
    return false;
  }
}
