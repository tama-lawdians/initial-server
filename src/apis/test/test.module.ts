import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PubSubModule } from '../pub-sub/pub-sub.module';
import { TestResolver } from './test.resolver';
import { TestService } from './test.service';

@Module({
  imports: [PubSubModule, HttpModule],
  providers: [TestResolver, TestService],
})
export class TestModule {}
