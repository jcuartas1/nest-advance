import { Injectable } from '@nestjs/common';
import { Interval, IntervalHost } from 'src/scheduler/decorators';

@IntervalHost
export class CronService {

  @Interval(1000)
  everySecond(){
    console.log('This will be logged every secondo');
  }
}
