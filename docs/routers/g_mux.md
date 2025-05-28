---
sidebar_position: 3
---

# Gorilla Mux

The [Gorilla Mux](https://github.com/gorilla/mux) router is supported by Gleece's routes generator.


### Set Router Engine
In the Gleece configuration (usually `gleece.config.json`), set the `routesConfig->engine` to `mux`.

### Configure Security Function
In the Gleece configuration, set the full package path in `routesConfig->authorizationConfig->authFileFullPackageName` (e.g., `github.com/gopher-fleece/gleece/security`).

### Generate Routes File 
Gleece CLI will generate a routes file from your annotated controllers. The output file path is specified in the `routesConfig->outputPath` property of your Gleece configuration file.

### Import and Register Routes
In your `main.go` file, import the generated routes file and call the `RegisterRoutes` function to register the routes with the `Gorilla Mux` router instance.

### Routing Example
```go
package main

import (
   "net/http"

   "github.com/gorilla/mux"
   "<package>/routes" // Import the generated routes file
)

func main() {
   // Create a Mux router
   router := mux.NewRouter()

   // Register Gleece routes
   routes.RegisterRoutes(router)

   // Start the server
   http.ListenAndServe(":8080", router)
}
```

### Authentication Function
```go
package security

import (
    "context"
    "net/http"
    
    "github.com/gopher-fleece/runtime"
)

func GleeceRequestAuthorization(ctx context.Context, r *http.Request, check runtime.SecurityCheck) (context.Context, *runtime.SecurityError) {
    return ctx, nil
}
```