mosaic = angular.module "Mosaic4Cap", [
  'ngRoute'
]


mosaic.controller 'mainController', ($scope) ->
  $scope.test = "test"


mosaic.controller 'invoiceController',
  class TodoCtrl
    list: [
      text: "learn coffescript"
      done: false
    ,
      text: "learn angular"
      done: true
    ]

    addTodo: ->
      @list.push
        text: @input
        done: false
      @input = ''

    remaining: ->
      count = 0
      for todo in @list
        count += if todo.done then 0 else 1
      count

    archive: ->
      oldList = @list
      @list = []
      for todo in oldList
        unless todo.done
          @list.push todo


mosaic.config ['$routeProvider', ($routeProvider)  ->
  $routeProvider
  .when('/', {
      templateUrl: 'pages/main.html'
      controller: 'mainController'
    })
  .when('/login', {
      templateUrl: 'pages/login.html'
      controller: 'loginController'
    })
  .when('/invoice', {
      templateUrl: 'pages/invoice.html'
      controller: 'invoiceController'
    })

  .otherwise({
      redirectTo: '/'
    })
]