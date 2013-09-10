<?php include '../template/header.php'; ?>
    <link href="/css/geo.css" rel="stylesheet" />
    <div class="jumbotron">
       <div class="container">
         <h1>Let's Geography<div class="pull-right">Week of Sept. 9th</div></h1>
         <p>Mrs. Howard's Class</p>
       </div>
     </div>
     <div class="container">
        <div class="page-header">
          <h1>Instructions <small>Let's Learn!</small></h1>
          <p>Below is a map of the contiguous United States. To get started, select a region, and then click begin. You will be prompted to fill out the shown state. Good luck!</p>
        </div>
         <div class="regions">
             <button type="button" class="btn-primary">All</button>
             <button type="button" class="btn-primary">Northeast</button>
             <button type="button" class="btn-primary">Midwest</button>
             <button type="button" class="btn-primary">South</button>
             <button type="button" class="btn-primary">West</button>
             <button type="button" class="btn-danger pull-right">Begin!</button>
         </div>
         <div class="map"></div>
     </div>
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="http://d3js.org/topojson.v1.min.js"></script>
    <script src="/js/map.js" type="text/javascript"></script>
    <script type="text/javascript" src="/js/geo.js"></script>
  <?php include '../template/footer.php'; ?>