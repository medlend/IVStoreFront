angular.module('CrudApp', []).config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {templateUrl: 'lists.html', controller: ListCtrl}).
    when('/add-user', {templateUrl: 'add-new.html', controller: AddCtrl}).
    when('/edit/:id', {templateUrl: 'edit.html', controller: EditCtrl}).
    otherwise({redirectTo: '/'});


}]);


function ListCtrl($scope, $http) {
    //console.log('zzz');
    $http.get('http://localhost/IVStore/web/app_dev.php/zones').success(function(data) {
       // console.log(data);
        $scope.zones = data;
        handleload(data);
    });

    var canvas=document.getElementById("canvasList");
    var ctx=canvas.getContext("2d");

    function reOffset(){
        var x=canvas.getBoundingClientRect();
        offsetX=x.left;
        offsetY=x.top;
    }
    var offsetX,offsetY;
    reOffset();
    window.onscroll=function(e){ reOffset(); }

function handleload(data){

    data.forEach(function(element) {
        drawLigne(element.liste_points,element.couleur);
    });
}

    function drawLigne(points,couleur) {

        ctx.fillStyle = couleur;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        points.forEach(function(element) {
            ctx.lineTo(element.x, element.y);
        });

        ctx.closePath();
        ctx.fill();

    }

}



function AddCtrl($scope, $http, $location) {

    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var cw=canvas.width;
    var ch=canvas.height;

    function reOffset(){
        var x=canvas.getBoundingClientRect();
        offsetX=x.left;
        offsetY=x.top;
    }
    var offsetX,offsetY;
    reOffset();
    window.onscroll=function(e){ reOffset(); }

    var points = [];

    $("#canvas").mousedown(function(e){handleMouseDown(e);});

   //var couleur=document.getElementById("idcouleur");
    function drawLigne(x, y) {

        var anObject = {x: x, y: y};
        points.push(anObject)

        console.log(points);

        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        points.forEach(function(element) {
            ctx.lineTo(element.x, element.y);
        });

        ctx.closePath();
        ctx.fill();
    }


    function drawCircle(cx,cy){
        ctx.beginPath();
        ctx.fillStyle = '#f00';
        ctx.arc(cx,cy,2,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

    function handleMouseDown(e){
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        mx=parseInt(e.clientX-offsetX);
        my=parseInt(e.clientY-offsetY);
        drawCircle(mx,my);
        drawLigne(mx,my)
    }



    $scope.master = {};
    $scope.activePath = null;

    $scope.add_new = function(zone, AddNewForm) {

        zone.listePoints=points;

        console.log(zone);
        // angular.toJson(zone);
        $http.post('http://localhost/IVStore/web/app_dev.php/zone', zone).success(function(){
            $scope.reset();
            $scope.activePath = $location.path('/');
        });

        $scope.reset = function() {
            $scope.zone = angular.copy($scope.master);
            console.log($scope.master);
        };

        $scope.reset();

    };
}

function EditCtrl($scope, $http, $location, $routeParams) {
    var id = $routeParams.id;
    $scope.activePath = null;

    $http.get('http://localhost/IVStore/web/app_dev.php/zone/'+id).success(function(data) {
        $scope.zone = data;
        console.log($scope.zone);
        drawLigneEdit(data.liste_points,data.couleur);
    });

    var canvas=document.getElementById("canvasEdit");
    var ctx=canvas.getContext("2d");

    function reOffset(){
        var x=canvas.getBoundingClientRect();
        offsetX=x.left;
        offsetY=x.top;
    }
    var offsetX,offsetY;
    var points = [];
    var pointEdit =[];
    reOffset();
    window.onscroll=function(e){ reOffset(); }

    function drawLigneEdit(points,couleur) {

        ctx.fillStyle = couleur;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        points.forEach(function(element) {
            ctx.lineTo(element.x, element.y);
        });
        ctx.closePath();
        ctx.fill();

    }

    $("#canvasEdit").mousedown(function(e){handleMouseDown(e);});

    //var couleur=document.getElementById("idcouleur");
    function drawLigne(x, y) {

        var anObject = {x: x, y: y};
        pointEdit.push(anObject)

        console.log(pointEdit);

        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(pointEdit[0].x, pointEdit[0].y);

        pointEdit.forEach(function(element) {
            ctx.lineTo(element.x, element.y);
        });

        ctx.closePath();
        ctx.fill();
    }


    function drawCircle(cx,cy){
        ctx.beginPath();
        ctx.fillStyle = '#f00';
        ctx.arc(cx,cy,2,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

    function handleMouseDown(e){
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        mx=parseInt(e.clientX-offsetX);
        my=parseInt(e.clientY-offsetY);
        drawCircle(mx,my);
        drawLigne(mx,my)
    }

    $scope.update = function(zone){

        if(pointEdit.length != 0){
            console.log('aa');
            zone.listePoints=pointEdit;
        }
        console.log(zone);
        $http.put('http://localhost/IVStore/web/app_dev.php/zone/'+id, zone).success(function(data) {
            $scope.zone = data;
            $scope.activePath = $location.path('/');
        });
    };

    $scope.delete = function(zone) {
        console.log(zone);

        var deleteZone = confirm('Are you absolutely sure you want to delete?');
        if (deleteZone) {
            $http.delete('http://localhost/IVStore/web/app_dev.php/zone/'+id);
            $scope.activePath = $location.path('/');
        }
    };
}