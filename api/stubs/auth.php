<?php
  header('Access-Control-Allow-Origin: http://localhost:8080');
  header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
  //header('HTTP/1.1 401 Unauthorized');

  sleep(1);
  echo (file_get_contents('../_auth.json'));
?>