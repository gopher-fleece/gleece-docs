---
title: Building a Services API Ecosystem
---

# The Ecosystem of the API

Building a REST API (or alternatives like GraphQL, gRPC, etc., though here we'll focus on HTTP REST) is not just about adding endpoints that receive calls and execute logic.

That's only the beginning. In a real-world server environment, there's much more to consider.

When building an API, you need to account for multiple aspects in your design: API consumers (both internal and external services), frontend applications, authentication mechanisms to verify request origins, permission checking with RBAC implementation, and input validation - and these are just the basics. Additional considerations include auditing, error handling, and many other critical components.

## The Two Main Sections

Generally, this ecosystem divides into two main sections:
1. The API consuming ecosystem
2. The API handling ecosystem

The **API consuming ecosystem** encompasses all external entities: other services, frontend applications, public APIs, documentation consumers, etc., that interact with the API.

The **API handling ecosystem** includes all the API's internal logic that must be managed, from authorization and validation to business logic implementation.

While numerous excellent tools exist for addressing each of these challenges, we'll share our design approach to tackle these challenges - from the theoretical desired solution to a practical implementation using our `Gleece` tool in `Go`.

> Needless to say, these design principles can be implemented using any technology stack out there.

## Challenges with Basic API Implementation

### API Consuming Ecosystem

Let's examine the API consuming ecosystem. What are the drawbacks of simply exposing a REST API and allowing the frontend or other services to use `fetch` (or `curl`, or any HTTP client tool) to interact with the API endpoints?

There are several significant issues:

- **Type Duplication** - While the API service creates interfaces/types/classes to model data, each consuming service must declare these again. When the model changes, you need to update all these "mirrors" across all services. This becomes a maintenance nightmare when your API is substantial and consumed across multiple teams.

- **Runtime API Mismatches** - Mistakes are inevitable. When someone modifies an API and accidentally overlooks updating one of the consumers, everything might appear fine during the build process - until it surfaces as a runtime bug requiring investigation.

- **Documentation Drift** - Similar to the previous point, maintaining documentation for a live product often results in outdated information. Keeping documentation synchronized with each new feature addition becomes increasingly challenging.

- **Repeated Boilerplate** - APIs typically require common behaviors that must be duplicated for each API consumer and call when using a "naked" HTTP client.

### API Handling Ecosystem

Similarly, for the `API handling ecosystem`, simply adding new routes to handle requests and implement logic isn't sufficient for a production-grade product. You need:

- **Default Validation** - Input validation should be automated and standardized
- **RBAC Declaration** - Each route should specify required permissions, with a common handler enforcing them
- **Documentation** - Documentation should be tightly coupled with code, automatically updating when code changes
- **Common Behaviors** - Production requirements like auditing and reporting should be handled uniformly, not implemented repeatedly
- **Simplicity and Unification** - Last but not least, need a tool/library/framework that makes developers' implementation easy and straightforward.

## The Solution Design

The key principle is: Write once, and let the infrastructure processes handle everything else.

To address the `API handling ecosystem`, the API declaration should utilize a library or framework that provides:

- Specification generation
- Parameter and payload declaration
- RBAC permission specification
- Validation
- Common error handling
- Expandability to any requested common logic (Auditing, Telemetry, logging etc.)

The solution design for the `API consuming ecosystem` should follow this principle: write once in the API service, generate a specification that includes the APIs and models, and distribute it during the build process to all consumers.

Consumers receive the updated specification and use it to generate an SDK with ready-to-use APIs and models, including common concerns like authentication and telemetry. In case of mismatches, the build fails immediately.

This approach allows developers to focus on their business logic while the framework ensures documentation remains synchronized, payloads are validated, and security checks are performed.

Sound too good to be true?

Let's examine this in practice, using:
- `Gleece` as the tool for the `Golang` API service
- `OpenAPI` v3.0.0 as the specification standard
- A TypeScript consumer using `OpenAPI Generator`