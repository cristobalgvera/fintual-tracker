import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  set<T = unknown>(key: string, data: T) {
    return this.redisClient.set(key, JSON.stringify(data));
  }

  async get<T = unknown>(key: string): Promise<T> {
    const data = await this.getRaw(key);

    if (data === null) throw new Error(`Key ${key} has not been set`);

    try {
      return JSON.parse(data);
    } catch (error) {
      throw new InternalServerErrorException(
        `Value for key ${key} is not a valid JSON string`,
      );
    }
  }

  getRaw(key: string) {
    return this.redisClient.get(key);
  }
}
