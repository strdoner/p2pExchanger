package org.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InsufficientBalanceException extends RuntimeException{
    public InsufficientBalanceException() {
        super("Недостаточно средств на балансе!");
    }

    public InsufficientBalanceException(String message) {
        super(message);
    }
}
