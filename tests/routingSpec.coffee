describe 'A routing suite', ->

    it "should map routes to controllers", ->
      inject module "Mosaic4Cap"

      inject ($route) ->
        expect($route.routes["/"].controller).toBe "mainController"
        expect($route.routes["/"].templateUrl).toEqual "pages/main.html"

        expect($route.routes["/login"].controller).toEqual "loginController"
        expect($route.routes["/login"].templateUrl).toEqual "pages/login.html"

        expect($route.routes["/invoice"].controller).toEqual "invoiceController"
        expect($route.routes["/invoice"].templateUrl).toEqual "pages/invoice.html"

        # otherwise redirect to
        expect($route.routes[null].redirectTo).toEqual "/"
        return
      return
    return