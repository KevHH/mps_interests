<?php

//DB
$db = new PDO('mysql:host=localhost;dbname=mps_interests;charset=utf8mb4', 'root', '  ');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

$id = htmlspecialchars($_GET["query"]);

$info = get_data($db, "SELECT mps.id as 'id', first_name, last_name, constit, party FROM mps WHERE id = ?", $id, "info");
$property = get_data($db, "SELECT COUNT(*) as total, SUM(quantity) as quantity FROM property WHERE mp_id = ?", $id, "property");
$shares = get_data($db, "SELECT COUNT(*) as total FROM shares WHERE mp_id = ?", $id, "shares");
$jobs = get_data($db, "SELECT COUNT(*) as total, SUM(pay) as pay FROM jobs WHERE mp_id = ?", $id, "jobs");
$donations = get_data($db, "SELECT COUNT(*) as total, SUM(amount) as amount, COUNT(DISTINCT(donor)) as donors FROM donations WHERE mp_id = ?", $id, "donations");

$data = json_encode(array($info, $property, $shares, $jobs, $donations));
echo $data;

function get_data($db, $query, $params, $name) {
  $stmt = $db->prepare($query);
  $stmt->execute(array($params));

  $results = $stmt->fetchAll();
  $data = array($name => $results);

  return $data;
}
