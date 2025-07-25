import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MyTypeOrmModule } from './providers/typeorm/my-typeorm.module';
import { UsersModule } from 'src/modules/users/users.module';
import { QueueModule } from './providers/queue/queue.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { env } from './utils/env';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwksModule } from './providers/jwks/jwks.module';

@Module({
  imports: [
    MyTypeOrmModule,
    UsersModule,
    QueueModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: createKeyv({
          url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
          username: env.REDIS_USERNAME,
          password: env.REDIS_PASSWORD,
          database: env.REDIS_CACHE_DB
        })
      }),
    }),
    JwtModule.register({
      global: true
    }),
    JwksModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
