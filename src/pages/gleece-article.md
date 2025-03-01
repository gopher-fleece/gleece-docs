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
- Straightforward ways to control and customize common behaviors at both system and endpoint levels.

Overall, the solution should yield a predictable and stable ecosystem- a zero-surprise product.

## Shaping The Solution  

When designing system architecture, one crucial yet often overlooked factor is the human element: the people who will contribute and maintain it.

Key questions to consider:
- Who will be writing code for this system?
- What are their mindsets and workflows?
- What expectations should we set for contributors?

These questions are crucially important for any system that's not only technically sound but also sustainable and enjoyable to work with.

With this understanding, we distinguishes between two key roles:

- Developers – Those who implement endpoints as part of specific features.
  Developers want to focus on their business logic and move on quickly.
  For them, the goal is to provide the simplest, most intuitive experience possible.

- Maintainers – The service owners responsible for the product's infrastructure and overall behavior.
  For maintainers, it is essential to offer maximum flexibility for customizing and extending the system's behavior at both high and low levels.

In short, developers should be able to write their logic effortlessly while the infrastructure automatically enforces all required behaviors and safety measures in a foolproof manner.

For maintainers, the system should be nearly maintenance-free, with required behaviors easily distributed across both providers and consumers.

To this end, an OpenAPI specification will be generated directly from the code.
This means the API code serves as the definitive source of truth, with the specification acting as the "glue" that binds the entire ecosystem together.
Consumers can then leverage a wide range of tools to automate boilerplate model and route generation, and call API endpoints seamlessly.

### Tooling

With this vision in mind and drawing massive inspiration from the [TSOA](https://tsoa-community.github.io/docs/) TypeScript project,
we've created the [Gleece](https://github.com/gopher-fleece/gleece) project for Golang.

Gleece analyzes controllers and their associated functions and structs to generate both:

1. An *OpenAPI* specification `v3.0.0`/`v3.1.0` that will be used by all API consumers

2. A fully featured set of routes, to be used with a router of choice (e.g., `gin` or `echo`).
   Route generation employs a standard Handlebars templating engine.

This optimizes the developer's day-to-day experience by abstracting away most complexity
while the generative approach provides maintainers with simple yet powerful ways to extend or
replace templates for deep customization of custom behaviors without sacrificing ease of use or
higher level configurations such as middleware injection sites (e.g., `beforeOperation`)

The final generated code is designed to behave like human-written code; Fast, readable, easily debuggable, and bypassable, when necessary.

### What Should The Developer's Experience Look Like?

The developer experience should looks like this, simply create struct, declare function and Go.

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
// @Route(/example-logic)
// @Body(example) The example object
// @Response(200) The new ID for the example
// @ErrorResponse(500) Error when processing fails
// @Security(securitySchemaName, { scopes: ["read", "write"] })
func (ec *ExampleController) ExampleLogic(
    example Example
) (string, error) {
    newId := uuid.New()
    return newId.String(), nil
}
```

The above example illustrates the typical developer experience- simply write a function and structs and annotate them.

### What Should The Maintainer's Experience Be?

The toolkit should provide the essential logic and documentation out-of-box and let maintainer focus on adjusting it to their specific needs.
Maintainers should be able to, for instance, enforce standard security measures, integrate complex telemetry systems or apply
smart, per-endpoint rate-limits without affecting the developer's experience.

In practice, this facet is difficult to visualize as it highly dependent on the chosen toolkit.

## Infrastructure by OpenAPI

Once the API provider is built, the "output" is the *OpenAPI* specification.
Consumers can use tools such as [`@openapitools/openapi-generator-cli`](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) to generate
the necessary models and calls.

As the process is fully programmatic, it can and *should* be integrated into the *CI/CD* pipeline- providers publish specifications and consumer builds "pull"
them, drastically reducing the chance for silent accidental API mismatches and ensuring changes propagate effortlessly across the entire ecosystem.


# Conclusion

Implementing, deploying and maintaining an API can be fun - or a nightmare.
The main difference lies in a holistic view that considers the shortcomings of existing approaches and places emphasis on developer experience and psychology.

We hope this brief article would help bring others the same enjoyment it has brought us.
