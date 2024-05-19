<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$markdown = $data['markdown'] ?? '';

require 'vendor/autoload.php';
use Parsedown;

$Parsedown = new Parsedown();
$html = $Parsedown->text($markdown);

// HTMLを含むレスポンスをJSON形式で返す
echo json_encode(['html' => $html]);