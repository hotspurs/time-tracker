angular.module('app', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']).controller('mainCtrl', function ($scope, $window, $http) {

  $scope.entries = [];

  moment.locale('ru');

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
      $scope.entries = data.data;

      console.log('ENTRIES', data.data);

      $scope.entries.forEach(function(item){
        item.editing = false;
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
