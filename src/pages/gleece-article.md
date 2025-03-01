---
title: Building a Services API Ecosystem
---

### This article is written by [Haim Kastner](https://github.com/haimkastner) & [Yuval Pomerchik](https://github.com/yuval-po),
### Team & Technology Leaders at Check Point Software Technologies and creators/maintainers of [Gleece](https://github.com/gopher-fleece/gleece).
### All opinions expressed are their own.

# Let's Talk About API Ecosystems

At first glance, RESTful APIs seem pretty straightforward, right? Just a client and server trading messages in an agreed-upon format. But if you've ever built one for a real-world application, you know there's a lot more to it than that.

The truth is, APIs often become the pain points of applications. Why? Because there's a whole world of challenges to tackle: you've got multiple consumers across different domains, you need to handle authentication and authorization, validate inputs, manage errors, implement rate limits... and that's just scratching the surface!

As your product grows, you need a robust approach that can grow with it. Let's dive into our take on treating APIs as complete ecosystems – from development to deployment, maintenance, and consumption.

## Why Basic API Implementation Isn't Enough

Let's examine this in two main parts:

### The Consumer Side Story

Consider a standard setup: you have a REST API endpoint, and you're allowing frontend applications or other services to interact with it using basic HTTP tools. While this appears simple, it presents several significant challenges:

    * Model Duplication Challenges – Your API defines data structures, but each consumer must define them again. 
    When changes occur, updating these duplicate definitions across all consumers becomes increasingly complex, 
    especially when dealing with multiple teams using different technology stacks.

    * Runtime Synchronization Issues – Changes to the API that aren't properly propagated to all consumers can 
    create latent issues that manifest unexpectedly in production environments, leading to service disruptions.

    * Documentation Management – Maintaining synchronized documentation in a dynamic enterprise environment presents 
    a significant challenge. Each change requires careful coordination to ensure documentation remains accurate.

    * Repetitive Implementation Patterns – Using basic HTTP clients necessitates repeating similar code patterns 
    across consumers and endpoints, leading to inefficient development processes and potential inconsistencies.


### The Provider's Perspective

Building a production-ready API requires much more than implementing endpoints and their core logic. A robust API endpoint needs several essential features:

- *Input Validation* (ensuring data integrity)
- *Role-Based Access Control* (managing access permissions effectively)
- *Documentation* (maintaining clear and current reference materials)
- *Logging* (tracking system behavior and issues)
- *Telemetry* (measuring and monitoring performance)

Implementing these features individually for each endpoint quickly becomes unsustainable and error-prone.

## What We Really Need

Here's our vision for an ideal solution:
- Documentation is always up-to-date.
- Consumers are always synchronized with the provider's specification.
- API changes do not require in-depth knowledge or force developers to "remember" to add essential behaviors (e.g., validation, authorization).
- API changes are safe by design.
- Implementations require minimal boilerplate.
- Common behaviors follow a unified standard (e.g., consistent error formats).
- There are straightforward ways to control and customize common behaviors at both system and endpoint levels.

Overall, the solution should yield a predictable and stable ecosystem — a zero-surprise product.

## Designing the Solution

When designing system architecture, one crucial yet often overlooked factor is the human element: the people who will contribute and maintain it.

Key questions to consider:
- Who will be writing the code?
- What are their mindsets and workflows?
- What expectations should we set for contributors?

These questions are crucially important for any system that's not only technically sound but also sustainable and enjoyable to work with.

With this understanding, we distinguish between two key roles:

- Developers – Those implementing endpoints for specific features.
  They need to focus on business logic with minimal overhead.
  For them, the goal is to provide the simplest, most intuitive experience possible.

- Maintainers – The service owners responsible for the product's infrastructure and overall behavior.
  For them, it is essential to offer maximum flexibility for customizing and extending the system's behavior at both high and low levels.

The ideal architecture allows developers to write logic efficiently while the infrastructure automatically handles safety and behavior requirements. Simultaneously, maintainers receive a low-maintenance system with comprehensive customization options.

To this end, an OpenAPI specification will be generated directly from the code.
This means the API code serves as the definitive source of truth, with the specification acting as the "glue" that binds the entire ecosystem together.
Consumers can then leverage a wide range of tools to automate boilerplate model and route generation, and call API endpoints seamlessly.

### Tooling

With this vision in mind and drawing inspiration from the [TSOA](https://tsoa-community.github.io/docs/) project in TypeScript,
we developed [Gleece](https://github.com/gopher-fleece/gleece) for Golang.

Gleece analyzes controllers and their associated functions and structs to generate:

1. An *OpenAPI* specification (`v3.0.0`/`v3.1.0`) that will be used by all API consumers

2. A fully featured set of routes, to be used with a router of choice (e.g., `gin` or `echo`).
   Route generation employs a standard Handlebars template engine.

This optimizes the developer's day-to-day experience by abstracting away most complexity
while the generative approach provides maintainers with simple yet powerful ways to extend or
replace templates for deep customization of custom behaviors without sacrificing ease of use or
higher-level configurations such as middleware injection sites (e.g., `beforeOperation`)

The final generated code is designed to behave like human-written code; Fast, readable, easily debuggable, and bypassable when necessary.

### What Should The Developer's Experience Look Like?

The developer experience should look similarly to this — simply create a struct, declare a function, and Go.

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

The above example illustrates the typical developer experience — simply write a function and structs and annotate them.

### What Should The Maintainer's Experience Be?

The toolkit should provide the essential logic and documentation out-of-box and let maintainers focus on adjusting it to their specific needs.
Maintainers should be able to, for instance, enforce standard security measures, integrate complex telemetry systems or apply
smart, per-endpoint rate limits without affecting the developer's experience.

In practice, this facet is difficult to visualize as it is highly dependent on the chosen toolkit.

## OpenAPI As An Infrastructure

Once the API provider is built, the "output" is the *OpenAPI* specification.
Consumers can use tools such as [`@openapitools/openapi-generator-cli`](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) to generate
the necessary models and calls.

As the process is fully programmatic, it can and *should* be integrated into the *CI/CD* pipeline — providers publish specifications and consumer builds "pull"
them, drastically reducing the chance for silent accidental API mismatches and ensuring changes propagate effortlessly across the entire ecosystem.


## Conclusion

Implementing, deploying and maintaining an API can be fun — or a nightmare.
The main difference lies in a holistic view that considers the shortcomings of existing approaches and places emphasis on developer experience and psychology.

We hope this brief article would help bring others the same enjoyment it has brought us.
