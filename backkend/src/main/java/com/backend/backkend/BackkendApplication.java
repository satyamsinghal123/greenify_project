package com.backend.backkend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@EnableConfigurationProperties({AppConfig.class})
public class BackkendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackkendApplication.class, args);
	}

}
