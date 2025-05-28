---
sidebar_position: 4
---

# Fiber

The [fiber v2](https://github.com/gofiber/fiber) router is supported by Gleece's routes generator.


### Set Router Engine
In the Gleece configuration (usually `gleece.config.json`), set the `routesConfig->engine` to `fiber`.

### Configure Security Function
In the Gleece configuration, set the full package path in `routesConfig->authorizationConfig->authFileFullPackageName` (e.g., `github.com/gopher-fleece/gleece/security`).

### Generate Routes File 
Gleece CLI will generate a routes file from your annotated controllers. The output file path is specified in the `routesConfig->outputPath` property of your Gleece configuration file.

### Import and Register Routes
In your `main.go` file, import the generated routes file and call the `RegisterRoutes` function to register the routes with the `Fiber` router instance.

### Routing Example
```go
package main

import (
   "github.com/gofiber/fiber/v2"
   "<package>/routes" // Import the generated routes file
)

func main() {
   // Create a Fiber app
   app := fiber.New()

   // Register Gleece routes
   routes.RegisterRoutes(app)

   // Start the server
   app.Listen(":8080")
}
```

### Authentication Function
```go
package security

import (
    "context"

    "github.com/gofiber/fiber/v2"
    "github.com/gopher-fleece/runtime"
)

func GleeceRequestAuthorization(ctx context.Context, fiberCtx *fiber.Ctx, check runtime.SecurityCheck) (context.Context, *runtime.SecurityError) {
    return ctx, nil
}
```