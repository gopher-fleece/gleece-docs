---
sidebar_position: 2
---

# Echo

The [echo v4](https://github.com/labstack/echo) router is supported by Gleece's routes generator.


### Set Router Engine
In the Gleece configuration (usually `gleece.config.json`), set the `routesConfig->engine` to `echo`.

### Configure Security Function
In the Gleece configuration, set the full package path in `routesConfig->authorizationConfig->authFileFullPackageName` (e.g., `github.com/gopher-fleece/gleece/v2/security`).

### Generate Routes File 
Gleece CLI will generate a routes file from your annotated controllers. The output file path is specified in the `routesConfig->outputPath` property of your Gleece configuration file.

### Import and Register Routes
In your `main.go` file, import the generated routes file and call the `RegisterRoutes` function to register the routes with the `Echo` router instance.

### Routing Example
```go
package main

import (
    "github.com/labstack/echo/v4"
    "<package>/routes" // Import the generated routes file
)

func main() {
   // Create a Echo router
   e := echo.New()

   // Register Gleece routes
   routes.RegisterRoutes(e)

   // Start the server
   e.Start(":8080")
}
```

### Authentication Function
```go
package security

import (
    "context"

    "github.com/gopher-fleece/runtime"
    "github.com/labstack/echo/v4"
)

func GleeceRequestAuthorization(ctx context.Context, echoCtx echo.Context, check runtime.SecurityCheck) (context.Context, *runtime.SecurityError) {
    return ctx, nil
}
```