---
title: Building a Services API Ecosystem
---

### This article is written by [Haim Kastner](https://github.com/haimkastner) & [Yuval Pomerchik](https://github.com/yuval-po),
### Team & Technology leaders at Check Point Software Technologies and creators/maintainers of [Gleece](https://github.com/gopher-fleece/gleece).
### All opinions expressed are their own.

# The Ecosystem of an API

RESTful APIs are deceptively simple creatures — just an exchange of agreed-upon messages between client and server.

In reality, they're often a sore point for many applications, presenting interesting challenges both architectural and practical.

Designing an API means accounting for a myriad of scenarios and topics like multiple consumers across different domains, authentication and authorization with role-based access control, input validation, error handling, rate-limiting and much more.

As our offerings grow and mature, so too must our processes.

Below, we explore our perspective on APIs as holistic ecosystems — how they should be developed, deployed, maintained, and consumed.

## Challenges with Basic API Implementation

Generally, this ecosystem divides into two main sections:

### API Consumers

Let's examine the API consumer ecosystem:

What drawbacks arise from simply exposing a RESTful API endpoint and letting frontend applications or other services interact with it using basic HTTP tools?

There are several significant challenges, including:

    * Models Duplication – The API provider declares interfaces, types, or classes to model data, and every consumer must re-declare them.
	When the model changes, updating these "mirrors" across all consumers becomes a maintenance nightmare - especially when the API is used by multiple teams and technologies.

    * Runtime API Mismatches – Mistakes are inevitable. When an API is modified and one or more consumers aren’t updated accordingly, issues can remain dormant until they eventually manifest at runtime, causing unexpected and disruptive production failures.

    * Documentation Drift – As changes are made, documentation often drifts out of sync, particularly in live, enterprise environments.
	Keeping docs fully synchronized with each and every change quickly becomes both challenging and time-consuming.

    * Repeated Boilerplate – API calls typically require common behaviors that must be duplicated for each consumer and endpoint when using a bare-bones HTTP client approach.


### API Providers

Similarly, for API providers, simply adding new endpoints and their associated logic will not suffice for a production-grade product.

A "real" API endpoint will likely require multiple common behaviors such as:

- *Input Validation* 
- *Role-Based Access Control (RBAC)* 
- *Documentation* 
- *Logging*
- *Telemetry*

Implementing these behaviors for every endpoint is an error-prone nightmare.


## Requirements For The Solution

The solution should ensure that:

- Documentation is always up-to-date.
- Consumers are always synchronized with the provider's specification.
- API changes do not require in-depth knowledge or force developers to "remember" to add essential behaviors (e.g., validation, authorization).
- API changes are safe by design.
- Implementations require minimal boilerplate.
- Common behaviors follow a unified standard (e.g., consistent error formats).
- Maintainers have straightforward ways to control and customize common behaviors at both system and endpoint levels.

Overall, the solution should yield a predictable and stable ecosystem- a zero-surprise product.

## Shaping The Solution  

When shaping a solution for API tooling (and probably not only for API), it's important to distinguish between the two "users" of a tool/framework/design in general:

- *Developers* - Those who required to implement a logic and move on. For them, we want to provide the simplest experience possible.
- *Maintainers* - Those responsible for maintaining the service. For them, we want to give the maximum ability to extend and customize the tool's behavior to meet their needs.

For the developes, what we want is very simple, we want them to : Write your logic, and let the infrastructure handle all the rest inlcusing full pfoofe of develops mistakes / skipping some important call / process 

For the maintainers we want to build an infrastructure that will be easy to maintain and add any required common behavior, in the server or in the consumers.

To achieve that along with the requirements from the API, that design is, to use a tool that expose simple API for the developers, while handling Rest validation, authorization, etc,  expandable for common logic and most important, generates OpenAPI specification.

Using standard specification, the consumers will use the vast available tools of OpenAPI community to automated API calls and models of the server. 


### Tooling

With that vision, and with a massive inspiration from the [TSOA](https://tsoa-community.github.io/docs/) project for TypeScript, we have created the [Gleece](https://github.com/gopher-fleece/gleece) project for `Golang`.

A tool that analyzes controller functions and generates a bunch of routes that will be added to the server's routing engine.

This approach maximizes developers' day-to-day usage while the generated routes act at runtime like any other human-written routes, readable, easy to debug, and bypass when needed.

Similarly, this approach gives the maintainers not only a way to inject some middlewares but also the abilities to modify the final routes to the exact needs, due to the fact that the route templates can be extended and even fully overridden.


### How Developer's Experience Should Looks Like? 

Integrating a service with Gleece will provide a developer with an API that looks like this:

```go
// @Description Example object
type Example struct {
    // @Description Some text
    Text string `json:"text" validate:"required"`
    // @Description Some number
    Number int `json:"number" validate:"gte=1"`
}

// @Description Create an example
// @Method(POST)
// @Route(/logic/{example_name}/{example_id})
// @Query(email, { validate: "required,email" }) The example email
// @Path(id, { name: "example_id", validate:"gt=1" }) The example ID
// @Path(name, { name: "example_name" }) The example's name
// @Body(example) The example object
// @Header(origin, { name: "x-origin" }) The request origin
// @Header(trace) The trace ID
// @Response(200) The new ID of the example
// @ErrorResponse(500) Error when processing fails
// @Security(securitySchemaName, { scopes: ["read", "write"] })
func (ec *ExampleController) ExampleLogic(
    id int,
    email string,
    name string,
    origin string,
    trace *string,
    example Example) (string, error) {
    newId := uuid.New()
    return example.Text + " " + newId.String(), nil
}
```

As demonstrated, the developer can simply create a function, annotate it as needed, and they are ready to go.

Gleece will prepare everything else needed during the build, pre-configuring the validation, the security check, error handling, the extended common behavior, etc. And, not less important, nothing extra is required for the OpenAPI specification generation.

### How Maintainer's Experience Be?

The simplest and most straightforward method is to register middlewares to handle errors and some logic to run in a request handling lifecycle.

while still, in case of a full customization of the behavior, such as running each function in its own goroutine, implementing specific custom authorization mechanisms, etc., the maintainer have the ability to fully override the templates, and by it, the sky is literally the limit...

All of those, while the developer's experience remains the same.

## Infrastructure by OpenAPI

Once the server is ready, the "output" to the infrastructure is the OpenAPI specification. That specification should be used by all API consumers.

We have used `@openapitools/openapi-generator-cli` to generate the interfaces and the API for our consumers.

One of the key features in generating code is the ability to override templates, allowing the maintainers to modify the generated code to the service's needs, while developers are free to just use the generated API.

Integrating it with the CI/CD process ensures there is no chance of mismatches in APIs deployed to your system.

# Conclusion

Implementing and deploying an API can be fun or a nightmare. The difference lies in the holistic design that ensures developers focus on the core implementation of the logic, architects can adjust and customize the usage tooling to the product requirements, and the tool in use provides a specification that will be used in the consumer in the same manner.