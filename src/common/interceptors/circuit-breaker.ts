import { CallHandler } from "@nestjs/common";
import { tap, throwError } from "rxjs";

const SUCCESS_THRESHOLD = 3;
const FAILURE_THRESHOLD = 3;
const OPEN_TO_HALF_OPEN_WAIT_TIME = 60000;

enum CicuitBreakerState {
  Closed,
  Open,
  HalfOpen
}

export class CircuitBreaker {
  private state = CicuitBreakerState.Closed;
  private failureCount = 0;
  private successCount = 0;
  private lastError: Error;
  private nextAttempt: number;

  exec(next: CallHandler){

    if(this.state === CicuitBreakerState.Open){
      if(this.nextAttempt > Date.now()){
        return throwError(() => this.lastError)
      }
      this.state = CicuitBreakerState.HalfOpen;
    }

    return next.handle().pipe(
      tap({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      }),
    );
  }

  private handleSuccess(){
    this.failureCount = 0;
    if(this.state === CicuitBreakerState.HalfOpen){
      this.successCount++;

      if(this.successCount >= SUCCESS_THRESHOLD){
        this.successCount = 0;
        this.state = CicuitBreakerState.Closed;
      }
    }
  }

  private handleError(err: Error){
    this.failureCount++;
    if(
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CicuitBreakerState.HalfOpen
    ) {
      this.state = CicuitBreakerState.Open;
      this.lastError = err;
      this.nextAttempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME;
    }
  }
}