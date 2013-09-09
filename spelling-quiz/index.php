<?php include '../template/header.php'; ?>
    <link href="/css/spelling.css" rel="stylesheet" />
    <div class="jumbotron">
       <div class="container">
         <h1>Let's Spell<div class="pull-right">Week of Sept. 9th</div></h1>
         <p>Mrs. Howard's Class</p>
       </div>
     </div>
     <div class="container">
             <div class="page-header">
               <h1>Instructions <small>Let's Learn!</small></h1>
               <p>Using this website is fairly easy. Each box has an input field and a play button next to it. Simply hit the play button and you will hear a word. Spell the word in the box. When it's spelled correctly, the box will light up green. Otherwise, it will stay highlighted in yellow until spelled correctly. Ready? GO START SPELLING!
             </div>
             <h3>Progress</h3>
             <div class="progress progress-striped active">
               <div class="progress-bar"  role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                 <span class="sr-only">0% Complete</span>
               </div>
             </div>
             <div class="page-holder">
                     <div class="word-container"></div>
             </div>
             <div class="center">
                     <button id="submit" type="button" class="btn-primary">Next</button>
             </div>
     </div>
     <script type="text/javascript" src="/js/spelling.js"></script>
     <script type="text/javascript" src="/js/spellingData.js"></script>
  <?php include '../template/footer.php'; ?>