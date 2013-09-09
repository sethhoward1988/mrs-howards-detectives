<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

    $from = "spelling-quiz";
    $subject = stripslashes($_POST['subject']); 
    $body = stripslashes($_POST['body']); 
    
    $headers = "From: SpellingQuiz \r\n";
    $headers .= "Reply-To: no-reply@gmail.com \r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    
    mail("chloe.howard@nebo.edu",$subject,$body,$headers);
    mail("smiles.seth@gmail.com",$subject,$body,$headers);
    
?>
