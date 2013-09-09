<?php include '../template/header.php'; ?>
    <link href="/css/math.css" rel="stylesheet" />
    <div class="jumbotron">
       <div class="container">
         <h1>Math Time!<div class="pull-right">Week of Sept. 9th</div></h1>
         <p>Mrs. Howard's Class</p>
       </div>
     </div>
     <div class="container">
         <h1>Times Table Game</h1>
         <p>This game is simple, first put in the size of the times table grid you want to make. Then click the build button. Click on a cell in the grid and start filling out the right answers. Once you get an answer correct, you will automatically be moved to another cell. If you get stumped, you can click off one and come back to it later. Good Luck!</p>
         <div class="center">
            <input class="grid-size" type="number"></input>
            <button type="button" class="btn-primary build-button">Build It!</button><br />
            <div class="times-table"></div>
         </div>
     </div>
     <script type="text/javascript" src="/js/math.js"></script>
  <?php include '../template/footer.php'; ?>