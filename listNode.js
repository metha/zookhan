
var ZooKeeper = require ("zookeeper");

var nodes= {};

var zk = new ZooKeeper({
  connect: "localhost:2181"
 ,timeout: 1000
 ,debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN
 ,host_order_deterministic: false
 ,data_as_buffer: false
});

function watchNode(path) {
	console.log("Node info: " + path + " add watcher");

	zk.aw_get (path, function watch_cb(type, state, path) {
		//If the node disappeared
		if (ZooKeeper.ZOO_DELETED_EVENT == type) {
			console.log("Node Event: %s lost", path);
			// Remove it from the pool
			delete nodes[path];
			return;
		}

		watchNode(path); // Adding the watcher as soon as possible

		if (ZooKeeper.ZOO_CHANGED_EVENT == type) {
			//console.log("Node Event: %s changed", path);
		} else {
			console.log("Node Event: %s unmanaged event type: %s", path, type);
		}
	}, function (rc, error, stat, data) {
		//data_cb
		if (0 == rc) {
			if (nodes[path] != data) {
				//console.log("Node Event: %s data has been updated (new version: %d)", path, stat.version);
				console.log("Node Event: %s (old data: %s) (new data: %s)", path, nodes[path], data);
				nodes[path] = data;
console.log("nodes:");
Object.keys(nodes).forEach(function (key) {
	console.log("       key: " + key + " value: " + nodes[key]);
	console.log("       key: " + key + " address: " + JSON.parse(nodes[key]).address);
});
			}
			else
				console.log("Node Event: %s no data change", path);
		}
	});
}

function watchDir(path) {
	// Get children
	zk.aw_get_children2(path, function (type, state, path) {
		//watch_cb
		watchDir(path);

		if (ZooKeeper.ZOO_CHILD_EVENT == type)
			console.log("Dir Event: %s ZOO_CHILD_EVENT", path);
		else if (ZooKeeper.ZOO_SESSION_EVENT == type)
			console.log("Dir Event: %s ZOO_SESSION_EVENT", path);
		else
			console.log("Dir Event: %s unmanaged event type: %s", path, type);

	}, function (rc, error, children, stat) {
		// child2_cb
		console.log("Dir  info: %s children: %s", path, children)

		// For each children
		children.forEach(function (child) {
			// If node already known
			if (nodes[path + "/" + child]) {
				console.log("Node info: " + path + "/" + child + " is already known");
				// Do nothing
				return
			}
			// Else add a watcher on it
			watchNode(path + "/" + child);
		});
	});
}

zk.connect(function (err) {
  if(err) throw err;
  console.log ("zk session established, id=%s", zk.client_id);

	var path = "/dpl"

	watchDir(path);
});

