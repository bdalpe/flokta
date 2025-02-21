import { v4 as uuidv4 } from 'uuid';

interface OktaSystemLogEvent {
  uuid: string;
  published: string;
  eventType: string;
  actor: {
    id: string;
    type: string;
    displayName: string;
  };
  outcome: {
    result: string;
    reason?: string;
  };
  target: Array<{
    id: string;
    type: string;
    displayName: string;
  }>;
  client: {
    userAgent: string;
    ipAddress: string;
  };
}

class OktaEvent {
  private static eventTypes = [
    'user.session.start',
    'user.authentication.sso',
    'policy.evaluate_sign_on',
    'system.api_token.create',
    'system.api_token.revoke',
  ];

  private static getRandomIp(): string {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  private static getRandomEventType(): string {
    return this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
  }

  static generateLog(): OktaSystemLogEvent {
    const eventType = this.getRandomEventType();
    return {
      uuid: uuidv4(),
      published: new Date().toISOString(),
      eventType,
      actor: {
        id: uuidv4(),
        type: 'User',
        displayName: `User-${Math.floor(Math.random() * 1000)}`,
      },
      outcome: {
        result: Math.random() > 0.2 ? 'SUCCESS' : 'FAILURE',
        reason: Math.random() > 0.5 ? undefined : 'Invalid credentials',
      },
      target: [
        {
          id: uuidv4(),
          type: 'Application',
          displayName: `App-${Math.floor(Math.random() * 100)}`,
        },
      ],
      client: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ipAddress: this.getRandomIp(),
      },
    };
  }
}

export const genEvents = (count?: number) => {
	count ??= 1;

	const events = [];
	for (let i = 0; i < count; i++) {
		events.push(OktaEvent.generateLog());
	}

	return events;
}
