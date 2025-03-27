---
title: API, Units, and Quantities
---

### This article is written by [Haim Kastner](https://github.com/haimkastner) Technology Leader at Check Point Software Technologies and maintainer of [unitsnet-go](https://github.com/haimkastner/unitsnet-go).

# API, Units, and Quantities

Anyone who has ever designed an API that involves units of measurement has faced the same dilemma: what unit measurement should we choose?

It may sound trivial, but it isn’t.

When two components communicate via an API, one using the metric system and the other using the imperial system, what unit should the API use? Should we enforce a standard? (do we even want one?), and where should we handle all the necessary conversions?

This issue goes beyond just conventions in the API implementation. It's how to declare the API schema. For example, naming a field `theDistanceInKilometers` feels awkward, we want to name it simply `theDistance`. But if we do, we risk the consumer misunderstanding our intent. Relying on documentation alone for such a fundamental aspect of our API is also not ideal.

We want our API to express distances clearly, without caring whether the value is in meters or miles. Distance is distance, and the same principle applies to other units. We want to work with angles, not degrees, and speeds, not kilometers per hour. But... we must choose a specific unit, right?

What if I told you that you don’t?

You don’t need to convert anything, and each service doesn’t need to know or assume how the other operates while the API is readable and easy to work with.

How? let go deeper into that "problem".

### The Problem Goes Beyond APIs

This problem isn’t limited to APIs, it affects our codebase logic, too.

When we calculate distances, we use formulas that don’t inherently depend on specific units. However, because formulas are usually defined once and used in multiple places (or in external libraries) it's API written to a specific measurement (e.g. requires an integer represents meters), we must deal with back and forth unit conversions. And we need to specify whether a variable value is in meters, kilometers, miles, or knots and perform conversions as necessary.

This makes development clunky and error-prone.

Instead of simply declaring a `distance` variable, we often end up with `distanceInMeters`, `distanceInMiles`, etc. Otherwise, there’s no way to know what unit a function expects or returns.

As a result, different parts of the codebase use different units, leading to a tangled mess of endless conversions. Even if we standardize our measurement system, integrating external libraries still forces us to convert values back and forth, making our code unnecessarily complex.

And that’s the best-case scenario, where everything is well-documented and well-named.

Unfortunately, this is not always the case. When documentation is lacking, troubleshooting and debugging such code can become a nightmare.

### What Do We Really Want?

We want to treat units as units, not as their specific representations.

Just as we use integers without worrying about whether they’re little or big endian in the memory, we should be able to work with `Length`, `Angle`, `Speed`, and other unit types in a similar way.

Internally, our code should only deal with those abstract unit types. The specific representation should only be determined when interacting with external systems. For example, when calling a third-party library, we can "expose" the specific measurement value from the unit. Likewise, when receiving data, we should immediately "import" it into our internal unit representation.

This approach eliminates the need for manual conversions, making our codebase cleaner, more readable, and easier to debug.

## Meet the UnitsNet Project

The [UnitsNet](https://github.com/angularsen/UnitsNet) project was created to solve precisely this problem in software engineering.

It provides an extensive collection of units and quantities, represented as simple objects with a straightforward API. You can create a unit object from any quantity and retrieve its value in any other quantity.

One of the most powerful aspects of UnitsNet is its [definitions JSON](https://github.com/angularsen/UnitsNet/tree/master/Common/UnitDefinitions), which includes almost every imaginable measurement - length, angle, duration, temperature, mass, information, volume-flow-per-area (yes, [really](https://github.com/angularsen/UnitsNet/blob/master/Common/UnitDefinitions/VolumeFlowPerArea.json)), and many more. There are over 100 unit categories, even including [Mars time](https://github.com/angularsen/UnitsNet/blob/a37871a639d85c56d1ae7ef971b83c06728e1097/Common/UnitDefinitions/Duration.json#L159) for durations!

From these definitions, the generators produces unit objects for various programming languages:

- C# - [github.com/angularsen/UnitsNet](https://github.com/angularsen/UnitsNet)
- TypeScript - [github.com/haimkastner/unitsnet-js](https://github.com/haimkastner/unitsnet-js)
- Python - [github.com/haimkastner/unitsnet-py](https://github.com/haimkastner/unitsnet-py)
- Golang - [github.com/haimkastner/unitsnet-go](https://github.com/haimkastner/unitsnet-go)

All of these implementations share the same definitions and provide a similar API, with minor adjustments to fit each language’s conventions.

For this article, we’ll focus on Golang, though the same concepts apply to the other implementations.

### How It Works

```go
// An "Angle" to be used across the codebase 
var angle *units.Angle

// Create an angle from a degree number
angle, _ = units.AngleFactory{}.FromDegrees(180)

// Use the "Angle" object throughout the codebase

// Extract a specific quantity from the Angle when necessary
log.Println(angle.Radians()) // 3.141592653589793
```

As demonstrated, the `Angle` unit is created in a very clear way, no one can miss what the input represents (...) then in the codebase the angle object is only used. 

> The object even offers arithmetic comparison and more operations (see package [docs](https://github.com/haimkastner/unitsnet-go/blob/main/README.md#additional-methods)).

The same applies when there is a need to expose a specific quantity - it's loud & clear what the exposed value is.

## Handling Units in API DTOs

Back to the API...

So far, we’ve addressed unit handling in code, but what about API design? We still need to specify a concrete unit for numeric values in JSON (or other textual formats). we still have to specify a field like `lengthInMeters` for unit representations.

The solution? A **unit DTO (Data Transfer Object)** that contains both the value and the unit of measurement.

This way, the API can accept and return values in any unit, as long as the unit is explicitly specified.

For example:

```json
{
  "value": 1000,
  "unit": "Meter"
}
```

is equivalent to:

```json
{
  "value": 1,
  "unit": "Kilometer"
}
```

Both representations convey the same distance using the same specification schema, making the API clear, readable, and flexible.

And the best part, using Unitsnet, handling these DTOs is seamless. You can simply call `FromDTO()` to parse raw JSON into a unit object and `ToDTO()` to convert a unit object back into a structured JSON format with even an option to specify the desired representation.

## Integrating UnitsNet with API Routing and Specification

The final step is linking the DTO representation with API routing and specifications.

Once this is set up, developers only need to use DTOs in their API handlers, without worrying about the underlying units.

Let’s see this in action using **unitsnet-go** and **Gleece**.

> [Gleece](https://github.com/gopher-fleece/gleece) is a tool for defining API routes and OpenAPI specifications directly from controller functions.

### Example API: Handling Lengths

In this example, we’ll create an API that accepts a `Length` in the request body and returns a processed `Length`, optionally represented by specified unit via a query parameter.

To achieve this, we simply import **unitsnet-go** and declare the route using **Gleece**.

```go
package controllers

import (
	"github.com/gopher-fleece/runtime"
	"github.com/haimkastner/unitsnet-go/units"
)

// UnitsController
// @Tag(Units) Units Operations
// @Route(/units)
// @Description The Units API Example
type UnitsController struct {
	runtime.GleeceController // Embedding the GleeceController to inherit its methods
}

// The LengthFactory object to create the Length objects
var lf = units.LengthFactory{}

// @Description Post unit API and return the processed unit
// @Method(POST)
// @Route(/post-unit)
// @Query(useUnit) The unit to be used in response
// @Body(data) The unit to process
// @Response(200) The response with the processed unit
// @ErrorResponse(500) The error when process failed
func (ec *UnitsController) TestUnit(useUnit *units.LengthUnits, data units.LengthDto) (units.LengthDto, error) {
	// The unit to be processed
	var unit *units.Length

	// Load the unit from the DTO
	unit, _ = lf.FromDto(data)

	// TODO: Process the unit (logic here)

	// Return the processed unit
	return unit.ToDto(useUnit), nil
}
```

As you can see, **zero conversions** are needed, resulting in clean, human-readable code.

The OpenAPI specification generated by Gleece from this controller is also clear and easy to understand, produce, and consume. Simply use whatever unit works best in your system.

Live demo with OpenAPI 3.0.0 specification and service of the above code: [units-docs.gleece.dev](https://units-docs.gleece.dev/)

Check out the full example codebase: [go-api-units-example](https://github.com/haimkastner/go-api-units-example)

## Conclusion

Declaring and handling units in general, and especially in APIs, should not be a hassle. By using tools that follow the basic principle of treating units as abstract entities rather than specific representations, we can greatly simplify our code and APIs allowing readable, clear and easy to work with API.
