package com.acentra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class AcentraApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcentraApplication.class, args);
    }
}
