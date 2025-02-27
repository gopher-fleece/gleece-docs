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

Let's examine the API consuming ecosystem. What are the drawbacks of simply exposing a REST API and allowing the frontend or other services to use fetch (or curl, or any HTTP client tool) to interact with the API endpoints?

There are several significant issues, among them:

- *Models Duplication* - While in the API source creating interfaces/types/classes to model data, each consuming service must declare these again. When the model changes, you need to update all these "mirrors" across all services. This becomes a maintenance nightmare when your API is substantial and consumed across multiple teams and technologies.

- *Runtime API Mismatches* - Mistakes are inevitable. When someone modifies an API and accidentally overlooks updating one of the consumers, everything might appear fine during the build process - until it surfaces as a runtime bug.

- *Documentation Drift* - Similar to the previous point, maintaining documentation for a live product often results in outdated information. Keeping documentation synchronized with each tiny new feature addition becomes increasingly challenging.

- *Repeated Boilerplate* - APIs typically require common behaviors that must be duplicated for each API consumer and call when using a "naked" HTTP client.


### API Source

Similarly, for the API source ecosystem, simply adding new routes to handle requests and implement logic isn't sufficient for a production-grade product.

A real product route will require multiple common behaviors such as:

- *Input Validation* 
- *Role Based Access Control (RBAC)* 
- *Documentation* 
- *Logs*
- *Telemetry* 

And handling each topic individually in a route is a nightmare and error prone.

## Requirements For The Solution

The solution should includes 

- Documentation is always up-to-date
- Consumers always synchronized with the source's specification
- Adding API endpoints not require to "remember" critical actions (such as as calling validator...) 
- API changes are safe by design
- Minimal boilerplate when adding a new API endpoint
- Common standard to common behavior (errors are common -> common behavior for errors)
- Easy way to control and customize the endpoints common behaviors

In general, no surprizes, everything should be predictable.

## Designing The Solution  

The key principle is simple: Write once, and let the infrastructure processes handle everything else.

From the source code generate a specification that includes the APIs and models, and distribute it during the build process to all consumers.

Consumers receive the updated specification and use it to generate code with ready-to-use APIs and models, including common logic like authentication and telemetry. 

This approach allows developers to focus on their business logic while the framework ensures documentation remains synchronized, payloads are validated, security checks are performed, and other common logic is handled. The CI/CD infrastructure distributes the changes across the entire system, including external consumers.

While numerous excellent tools exist for addressing each of these challenges, we'll share our design approach to tackle these challenges - from the theoretical desired solution to a practical REST API demonstration using our [Gleece](https://github.com/gopher-fleece/gleece) tool for the Go community.

> Needless to say, these design principles are abstract and can be implemented using any technology stack and tools available.

### Shaping The Solution

When shaping a solution for API tooling (and probably not only for API), it's important to distinguish between the two "users" of a tool/framework:

- *Developers* - Those who need to implement the logic. For them, we want to provide the simplest experience possible.
- *Maintainers* - Those responsible for shaping the service. For them, we want to give the maximum ability to extend and customize the tool's behavior to meet their needs.

In many cases, it can be the same person, but it's still a different role, and it's important to address both properly.

As real-world products tend to require unpredictable and endless possible features and requirements, the approach we choose is to create Gleece similar to TypeScript's [TSOA](https://tsoa-community.github.io/docs/) approach, as a tool that analyzes controller functions and generates a bunch of routes that will be added to the server's routing engine.

This approach maximizes developers' day-to-day usage while the generated routes act at runtime like any other human-written routes, readable, easy to debug, and bypass when needed.

Similarly, this approach gives architects all the needed abilities to modify the final routes to the exact needs, due to the fact that the route templates can be extended and even fully overridden.

- *Specification Generation* - From the codebase without requiring extra effort from the developer. If it works, it is documented.
- *RBAC Permission Specification* - As simple as possible, with an enforcement mechanism so it cannot be bypassed.
- *Validation* - Except for edge cases, it should require nothing from the developer and be based solely on the models (class/interface) in the code.
- *Common Error Handling* - As simple as it sounds.
- *Expandability* - To any needed common logic (auditing, telemetry, logging, etc.)

### Developer's Experience

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

### Maintainer's Experience

The simplest and most straightforward method is to register middlewares to handle errors and some logic to run in a request handling lifecycle.:

In case a tighter integration with the routes is needed, let's say, reporting the OpenAPI's operationId to an audit service, there is a handlebars template extension option that will run on build, giving access to everything in the context.

For example, preparing an AfterOperationRoutesExtension to print succeeded operation ids:

```handlebars
if (opError == nil) {
    resString := ""
    {{#equal HasReturnValue true}}
        jsonValue, _ := json.Marshal(value)
        resString = string(jsonValue)
    {{/equal}}
    println("Operation '{{{OperationId}}}' succeeded, response: ", resString)
}
```

In case of a full customization of the behavior, such as running each function in its own goroutine, implementing specific custom authorization mechanisms, etc., there is an ability to fully override the templates, and by it, the sky is literally the limit...

All of those, while the developer's experience remains the same.

## Infrastructure by OpenAPI

Once the server is ready, the "output" to the infrastructure is the OpenAPI specification. That specification should be used by all API consumers.

We have used @openapitools/openapi-generator-cli to generate the interfaces and the API for our consumers.

One of the key features in the generator is the ability to override templates, allowing the architect to modify the generated code to the service's needs, while developers are free to just use the API.

Integrating it with the CI/CD process ensures there is no chance of mismatches in APIs deployed to your system.

# Conclusion

Implementing and deploying an API can be fun or a nightmare. The difference lies in the holistic design that ensures developers focus on the core implementation of the logic, architects can adjust and customize the usage tooling to the product requirements, and the tool in use provides a specification that will be used in the consumer in the same manner.