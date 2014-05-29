
var ZooKeeper = require ("zookeeper");

var nodes= {};

var zk = new ZooKeeper({
  connect: "localhost:2181"
 ,timeout: 1000
 ,debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN
 ,host_order_deterministic: false
 ,data_as_buffer: false
});

function watchDir(path) {
	// Get children
	zk.aw_get_children2(path, function (type, state, path) {
		//console.log("watch_cb: %s", path)
		if (type == ZooKeeper.ZOO_CREATED_EVENT || type == ZooKeeper.ZOO_CHANGED_EVENT) {
			console.log("Dir Event: %d (ZOO_CREATED_EVENT: %d, ZOO_CHANGED_EVENT: %d)", type, ZooKeeper.ZOO_CREATED_EVENT, ZooKeeper.ZOO_CHANGED_EVENT);
			watchDir(path);
		}
	}, function (rc, error, children, stat) {
		console.log("Listed children: %s", children)

		// For each children
		children.forEach(function (child) {
			// TODO: If child is new...
			// Get info
			zk.a_get(path + "/" + child, true, function data_cb(rc, error, stat, data) {
				console.log("Node info: " + path + "/" + child + ": " + data);
				//TODO: Store info
				nodes[path + "/" + child] = data;
			})

			zk.aw_exists (path + "/" + child, function watch_cb(type, state, path) {
				console.log("Node Event: path: %s type: %d state: %d", path, type, state)
				if (type == ZooKeeper.ZOO_DELETED_EVENT) {
					console.log("Node Event: %s deleted", path);
					delete nodes[path];
				} else {
					console.log("Node Event: %s unmanaged event type: %s", type);
				}
			}, function (rc, error, stat) {
				console.log("Node Stat: " + stat);
			})
		});
	});
}

zk.connect(function (err) {
  if(err) throw err;
  console.log ("zk session established, id=%s", zk.client_id);

	var path = "/dpl"

	watchDir(path);

});

