---
sidebar_position: 1
---

# Gin

The [Gin](https://github.com/gin-gonic/gin) router is supported by Gleece's routes generator.


### Set Router Engine
In the Gleece configuration (usually `gleece.config.json`), set the `routesConfig->engine` to `gin`.

### Configure Security Function
In the Gleece configuration, set the full package path in `routesConfig->authorizationConfig->authFileFullPackageName` (e.g., `github.com/gopher-fleece/gleece/security`).

### Generate Routes File 
Gleece CLI will generate a routes file from your annotated controllers. The output file path is specified in the `routesConfig->outputPath` property of your Gleece configuration file.

### Import and Register Routes
In your `main.go` file, import the generated routes file and call the `RegisterRoutes` function to register the routes with the `Gin` router instance.

### Routing Example
```go
package main

import (
    "github.com/gin-gonic/gin"
    "<package>/routes" // Import the generated routes file
)

func main() {
    // Create a Gin router
    router := gin.Default()

    // Register Gleece routes
    routes.RegisterRoutes(router)

    // Start the server
    router.Run(":8080")
}
```

### Authentication Function
```go
package security

import (
    "context"

    "github.com/gin-gonic/gin"
    "github.com/gopher-fleece/runtime"
)

func GleeceRequestAuthorization(ctx context.Context, ginCtx *gin.Context, check runtime.SecurityCheck) (context.Context, *runtime.SecurityError) {
    return ctx, nil
}
```