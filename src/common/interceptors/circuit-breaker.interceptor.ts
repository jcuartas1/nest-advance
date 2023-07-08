import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly circuitBreakerByHandler = new WeakMap<
    Function,
    CircuitBreaker
  >()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodRef = context.getHandler();

    let cicuitBreaker: CircuitBreaker;
    if(this.circuitBreakerByHandler.has(methodRef)){
      cicuitBreaker = this.circuitBreakerByHandler.get(methodRef)
    }else {
      cicuitBreaker = new CircuitBreaker();
      this.circuitBreakerByHandler.set(methodRef, cicuitBreaker)
    }
    return cicuitBreaker.exec(next)
  }
}
