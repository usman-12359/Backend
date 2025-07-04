import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ManagerService } from './services/manager.service';

@Injectable()
export class ManagerCron {
  constructor(private managerService: ManagerService) {}

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron(CronExpression.EVERY_10_MINUTES )
  // @Cron(CronExpression.EVERY_10_SECONDS) 
  async checkManagerSubscriptionCancellation() {
    await this.managerService.checkManagerSubscriptionCancellation();
    return true;
  }
  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron(CronExpression.EVERY_10_MINUTES )
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async cancelExpiredSubscriptions() {
    await this.managerService.cancelExpiredSubscriptions();
    return true;
  }
  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron(CronExpression.EVERY_10_MINUTES )
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async renewUpgradeSubscription() {
    await this.managerService.renewUpgradeSubscriptions();
    return true;
  }
}
