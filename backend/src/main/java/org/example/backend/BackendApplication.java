package org.example.backend;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		Configuration configuration = new Configuration();
		configuration.configure();
		//configuration.addAnnotatedClass(User.class);
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//Code here
	}

}
