---
title: 'Microservices with Spring Cloud and Netflix OSS'
date: '2019-02-05'
tags: ['Java', 'Spring']
---

I used Spring Coud and Netflix OSS to implement the beginnings of a microservices architecture.  We use components from both to allow separately deployed services to communicate with each other without manual administration.  

Spring Cloud is a project in the spring.io family which is based on components from Netflix OSS.  The integration into the Spring Environemnt uses auto-configuration and convention over configuration.

| Operations Component               | Netflix, Spring |
| -----------------------------------| --------------- |
| Service Discovery Service          | Netflix Eureka  |
| Edge Server                        | Netflix Zuul    |
| Dynamic Routing and load balancing | Netflix Ribbon  |

The components I used were:

* Netflix Eureka - allows microservices to register themselves at runtime
* Netflix Ribbon - used by service consumers to lookup services at runtime
* Netflix Zuul - is the gatekeeper to the outside world, not allowing any external unauthorised requests through.

A system landscape

There is one Business Service called Stock, more to follow.

Infrastructure and components are provided by Netflix Eureka(Service Discovery Server), Netflix Ribbon(Dynamic Routing and Load Balancer), Netflix Zuul(Edge Server)

Each component is build and in order to make it easier we have a shell script to orchestrate the Gradle build process.  

In the root of the project run:

```bash
./build-all.sh
```

Source Code Walkthrough

Each microservice is a standalone Spring Boot application and uses undertowas its web server.  Spring MVC is used for the REST based services and Spring RestTemplate is used to perform out-going calls.

Gradle dependencies

Spring Cloud provides a set of starter dependencies, which make it easy to incorporate dependencies for a feature.  To incorporate Eureka and Ribbon into a microservice to register/call other services simply add the below to the build script

```bash
compile("org.springframework.cloud:spring-cloud-starter-eureka:1.0.0.RELEASE")
```

To set-up a Eureka server add the following:

```bash
compile('org.springframework.cloud:spring-cloud-starter-eureka-server:1.0.0.RELEASE')
```

Infrastructure Services

Setting up a Eureka server is as simple as adding the @EnableEurekaServer annotation to a Spring Boot application.

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

To bring up a Zuul server add the @EnableZuulProxy annotation to a standard Spring Boot application.

```java
@SpringBootApplication
@Controller
@EnableZuulProxy
public class ZuulApplication {
	
    public static void main(String[] args) {
        new SpringApplicationBuilder(ZuulApplication.class).web(true).run(args);
    }
}
```

If one wishes to overwrite the default configuration one needs only to supply details to the application.yml file.

```yaml
zuul:
  ignoredServices: "*"
  routes:
    stock:
      path: /stock/*
      stripPrefix: false

```



Business Services

To auto register microservices with Eureka, add a @EnableDiscoveryClient - annotation to the Spring Boot application.

```java
@SpringBootApplication
@Controller
@EnableZuulProxy
public class ZuulApplication {
	
    public static void main(String[] args) {
        new SpringApplicationBuilder(ZuulApplication.class).web(true).run(args);
    }
}
```


Start up the system landscape

One needs curl and jq.  To start amicroservice execute ./gradlew bootRun.

Starting the infrastructure microservices is easy:

```bash
cd support/discovery-server; ./gradlew bootRun
cd support/edge-server; ./gradlew bootRun
```

Once the infrastructure microservices have started, then start the business services.

```bash
cd core/stock; ./gradlew bootRun
```

In the service discovery web app we should now be able to see our business service and the edge server (http://localhost:8761):

To find out more details about our services, e.g. what ip addresses and ports they use, we can use the Eureka REST API, e.g.:

```bash
curl -s -H "Accept: application/json" http://localhost:8761/eureka/apps | jq 
 '.applications.application[] | {service: .name, ip: .instance.ipAddr, port: .instance.port."$"}'
```

Calling stock via Zuul, which is configured on port 8765, is as easy as:

```bash
curl -s localhost:8765/stock/1 | jq .
```

Once you obtain the port from Eureka as outlined above, example 60151, calling stock on the network is a simple as

```bash
curl -s localhost:60151/stock/2 | jq .
```