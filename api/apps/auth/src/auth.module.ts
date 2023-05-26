import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_SERVICE,
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('REBBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASS}@${HOST}`],
            queue: QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class AuthModule {}
