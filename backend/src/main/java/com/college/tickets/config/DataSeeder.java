package com.college.tickets.config;

import com.college.tickets.model.*;
import com.college.tickets.repository.AppSettingsRepository;
import com.college.tickets.repository.DepartmentRepository;
import com.college.tickets.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AppSettingsRepository appSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      DepartmentRepository departmentRepository,
                      AppSettingsRepository appSettingsRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.appSettingsRepository = appSettingsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedDepartments();
        seedAdmin();
        seedSettings();
    }

    private void seedDepartments() {
        for (DepartmentName name : DepartmentName.values()) {
            if (departmentRepository.findByName(name).isEmpty()) {
                Department dept = new Department(name);
                departmentRepository.save(dept);
                log.info("Seeded department: {}", name);
            }
        }
    }

    private void seedAdmin() {
        String adminEmail = "admin@campus.edu";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User("Campus Admin", adminEmail,
                    passwordEncoder.encode("admin123"), Role.ADMIN);
            userRepository.save(admin);
            log.info("Seeded admin user: {}", adminEmail);
        }
    }

    private void seedSettings() {
        if (appSettingsRepository.count() == 0) {
            AppSettings settings = AppSettings.defaults();
            appSettingsRepository.save(settings);
            log.info("Seeded default app settings: SLA={}h, Reward={}, Penalty={}, Personal={}",
                    settings.getSlaHours(), settings.getRewardPoints(),
                    settings.getPenaltyPoints(), settings.getPersonalRewardPoints());
        }
    }
}
