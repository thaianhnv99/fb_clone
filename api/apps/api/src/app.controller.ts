import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { AUTH_SERVICE } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  @Get()
  async getUser() {
    return this.authService.send(
      {
        cmd: 'get-user',
      },
      {},
    );
  }
}
