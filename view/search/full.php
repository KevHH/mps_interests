<?php

//DB
$db = new PDO('mysql:host=localhost;dbname=mps_interests;charset=utf8mb4', 'root', '  ');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

$query = htmlspecialchars($_GET["query"]);

search($db, $query);

function search($db, $query) {
  $stmt = $db->prepare("SELECT * FROM text LEFT JOIN mps on mp_id = mps.id WHERE mp_id = ?");
  $stmt->execute(array($query ));

  $results = $stmt->fetchAll();
  echo(json_encode($results));

}
