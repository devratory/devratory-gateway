import { ClientRedis } from '@nestjs/microservices';
import { IStepPayload } from '../step';

class MSService {
  pattern: string | object;
  payload?: IStepPayload;
  client = new ClientRedis({
    url: process.env.REDIS_URL,
  });

  constructor() {
    this.connect();
    console.log(`Connecting to redis: ${process.env.REDIS_URL}`);
  }

  async connect() {
    await this.client.connect();
  }

  async call<T>(pattern: any, payload: any): Promise<T> {
    // Return mocked result by pattern
    const result = await this.client.send(pattern, payload).toPromise();
    console.log('MS Call result is', result);
    return result as any;
  }
}

export const msService = new MSService();
