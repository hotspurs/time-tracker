angular.module('app', ['ui.bootstrap', 'ui.bootstrap.datetimepicker', 'timer']).controller('mainCtrl', function ($scope, $window, $http, $uibModal) {

  $scope.entries = [];
  moment.locale('ru');

  $scope.showStatictic = false;

  $scope.showStaticticTrigger = function(){

    if(!$scope.showStatictic){
      $scope.chartist();
    }

    $scope.showStatictic = !$scope.showStatictic;
  }

  $scope.getWeekDaysHoursDuraction = function(){
    var data = [];


    var monday = moment().day(1),
        sunday = moment().day(7);

    data = $scope.entries.filter(function(item){

      return moment(item.start_at).isBetween(moment(monday), moment(sunday));

    });

    data = $scope.entries.map(function(item){

        var start_at = item.start_at,
            stop_at = item.stop_at,
            start_at_milsec = new Date(start_at),
            stop_at_milsec = new Date(stop_at);


      console.log('=>>>', (stop_at_milsec - start_at_milsec) / 60 / 60 / 60 );

      return (stop_at_milsec - start_at_milsec) / 60;


    });

  }

  $scope.chartist = function(){

    $scope.getWeekDaysHoursDuraction()

    var data = {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      series: [
        [0, 5, 3, 2, 0, 3, 1]
      ]
    };

    var options = {
      seriesBarDistance: 5
    };

    
    new Chartist.Bar('.chartist', data, options);
    /*

    var data = {
      series: [5, 3, 4]
    };


    var sum = function(a, b) { return a + b };

    new Chartist.Pie('.chartist_pie', data, {
      labelInterpolationFnc: function(value) {
        return Math.round(value / data.series.reduce(sum) * 100) + '%';
      }
    });
    */

  }

  /* ADD PROJECT POPUP */
  $scope.openAddProjectPopup = function () {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'projectsPopup.html',
      controller: 'projectsPopupCtrl',
      size: 'sm',
      resolve: {
        projects: function(){
          return $scope.projects;
        }
      }
    });
  };



  /* TIMER  / NEW ENTRY*/

 $scope.timerRunning = false;

 $scope.currentEntry = {};

 $scope.startTimer = function (){
    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;
    $scope.currentEntry.start_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  };

  $scope.stopTimer = function (){
    $scope.currentEntry.stop_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    $scope.addEntry(function(){
        $scope.timerRunning = false;
        $scope.$broadcast('timer-clear');
    });

  };

  $scope.addEntry = function(cb){
    $http.post('/api/time_entry', {
      project_id: $scope.currentEntry.project_id,
      description: $scope.currentEntry.description,
      start_at: $scope.currentEntry.start_at,
      stop_at: $scope.currentEntry.stop_at,
    }).then(function(data){
       
        $scope.currentEntry.id = data.id;

        $scope.entries.push($scope.currentEntry);

        $scope.entries = _.sortBy($scope.entries, function(entry){
          return entry.start_at;
        }).reverse();

        $scope.currentEntry = {};
        cb();
       if(data.id){
        console.log('ADDED');
       }
    }); 
  };


  $scope.formatDate = function(date){
    return moment(date).format("D MMM YYYY, H:mm:ss");
  }

  $scope.showEntryProject = function(project_id){

    var project = _.findWhere($scope.projects, {id:project_id});

    if(project){
      return project.name;
    } else {
      return '';
    }

  }

  $scope.showEntryTag = function(tag_id){
    var tag = _.findWhere($scope.tags, {id:tag_id});



    if(tag){
      return tag.name;
    } else {
      return '';
    }
  }

  $scope.deleteEntry = function(id){
    $http.delete('/api/time_entry/'+ id).then(function(data){
       console.log(data);
       if(data.data){
          var index = _.findIndex($scope.entries, {id: id });
          $scope.entries.splice(index, 1);
       }
    }); 
  }


  $scope.editModeEntry = function(id){
    var index = _.findIndex($scope.entries, {id: id });

    $scope.entries[index].editing = true;
  }

  $scope.saveChangesEntry = function(id){
    var index = _.findIndex($scope.entries, {id: id });

    var entry = $scope.entries[index];

    $scope.entries[index].editing = false;

    $scope.entries = _.sortBy($scope.entries, function(entry){
      return entry.start_at;
    }).reverse();

    $http.put('/api/time_entry', {
      id: entry.id,
      project_id: entry.project_id,
      description: entry.description,
      start_at: moment(entry.start_at).format('YYYY-MM-DD HH:mm:ss'),
      stop_at: moment(entry.stop_at).format('YYYY-MM-DD HH:mm:ss')
    }).then(function(data){
       console.log(data);
       if(data.data){
        console.log('SAVED');
       }
    }); 

  }

  function getEntries(){
    $http.get('/api/time_entry').then(function(data){
      $scope.entries = _.sortBy(data.data, function(entry){
        return entry.start_at;
      }).reverse();

      $scope.entries.forEach(function(item){
        item.editing = false;
        item.start_at = moment(item.start_at).format('YYYY-MM-DD HH:mm:ss');
        item.stop_at = moment(item.stop_at).format('YYYY-MM-DD HH:mm:ss');
      });
    });

  }

  function getProjects(){
    $http.get('/api/projects').then(function(data){
      $scope.projects = data.data;
    });
  }

  function getTags(){
    $http.get('/api/tags').then(function(data){
      console.log('Tags', data.data);
      $scope.tags = data.data;
    });
  }

  getEntries();
  getProjects();
  getTags();

});

angular.module('app').controller('projectsPopupCtrl', function ($scope, $http, $uibModalInstance, projects) {
  $scope.project = {};
  $scope.projects = projects;

  console.log('PROJECTS', projects);

  $scope.close = function () {
    $uibModalInstance.close();
  };

  $scope.deleteProject = function(project_id){
    $http.delete('/api/projects/'+ project_id).then(function(data){
       if(data.data){
          var index = _.findIndex($scope.projects, {id: project_id });
          $scope.projects.splice(index, 1);
       }
    }); 
  }

  $scope.addProject = function(){
    $http.post('/api/projects', {
      name: $scope.project.name
    }).then(function(data){
      
      $scope.project.id = data.data.id;
      $scope.project.user_id = data.data.user_id;

      $scope.projects.push($scope.project);

      console.log('PROJECTS', $scope.projects);

      $scope.project = {};

       if(data.id){
        console.log('ADDED PROJECT');
       }
    });

  }

});

