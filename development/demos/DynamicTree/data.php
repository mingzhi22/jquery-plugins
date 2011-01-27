<?php
// jsonp的函数名
$callback = $_GET["callback"];

$json = <<<JSON
[
	{
		id: '0001',
		name: '测试节点1',
		hasChild: true
	},
	{
		id: '0002',
		name: '测试节点2',
		hasChild: false
	},
	{
		id: '0003',
		name: '测试节点3',
		hasChild: true
	},
	{
		id: '0004',
		name: '测试节点4',
		hasChild: false
	},
	{
		id: '0005',
		name: '测试节点5',
		hasChild: true
	},
	{
		id: '0006',
		name: '测试节点6',
		hasChild: false
	},
]
JSON;

if(isset($callback)) {
	header('Content-Type: application/x-javascript');
	echo "$callback($json);";
} else {
	header('Content-Type: application/json');
	echo $json;
}
?>
