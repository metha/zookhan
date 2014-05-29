
var ZooKeeper = require ("zookeeper");

var tree= {};

var zk = new ZooKeeper({
  connect: "localhost:2181"
 ,timeout: 1000
 ,debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN
 ,host_order_deterministic: false
 ,data_as_buffer: false
});

/*
function child2_cb (rc, error, children, stat) {
    console.log ("child2_cb: rc:%d, error:%s, children:%s, stat:%s", rc, error, children, JSON.stringify(stat));
    children.forEach(function (child) {
        zk.a_get(child, false, data_cb);
    });
}

function watch_cb (type, state, path) {
    //zk.aw_get_children2("/dpl", watch_cb, child2_cb);
    console.log ("watch_cb: type:%d, state:%d, path:%s", type, state, path);
}

function data_cb (rc, error, stat, data) {
    console.log ("data_cb: rc:%d error:%s stat:%s data:%s", rc, error, JSON.stringify(stat), data);
}

*/

function loadDir(path) {
  zk.a_get_children2 ( path, true, function (rc, error, children, stat) {
		if !rc
			console.log("Error: %s", error);

		children.forEach(function (child) {
			console.log(child);
		});
	})
}

zk.connect(function (err) {
    if(err) throw err;
    console.log ("zk session established, id=%s", zk.client_id);

		loadDir("/");



//    zk.a_create ("/dpl/node.js1", "some value", ZooKeeper.ZOO_SEQUENCE | ZooKeeper.ZOO_EPHEMERAL, function (rc, error, path)  {
//        if (rc != 0) {
//            console.log ("Error: zk node create result: %d, error: '%s', path=%s", rc, error, path);
//        } else {
//            console.log ("created zk node %s", path);
//            process.nextTick(function () {
//                zk.close ();
//            });
//        }
//    });
});

