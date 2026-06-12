package com.expense.expense.config;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupLogger implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StartupLogger.class);

    @Override
    public void run(String... args) {
        log.info("Expense Tracker application started successfully.");
        log.info("SQL connection initialized.");

    }
}
