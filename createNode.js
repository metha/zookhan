
var ZooKeeper = require ("zookeeper");
var zk = new ZooKeeper({
  connect: "localhost:2181"
 ,timeout: 1000
 ,debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN
 ,host_order_deterministic: false
});

var version = 0;

zk.connect(function (err) {
    if(err) throw err;
    console.log ("zk session established, id=%s", zk.client_id);

//    zk.mkdirp ( "/dpl", function (e) {
//        console.log("Error: mkdirp: " + e);
//    })


    zk.a_create ("/dpl/", '{"id":"wub-broker1","container":null,"address":"tcp://wub-test107.neofonie.de:60619","position":-1,"weight":1,"elected":"0000000026"}', ZooKeeper.ZOO_SEQUENCE | ZooKeeper.ZOO_EPHEMERAL, function (rc, error, path)  {
        if (rc != 0) {
            console.log ("Error: zk node create result: %d, error: '%s', path=%s", rc, error, path);
        } else {
            console.log ("created zk node %s", path);


/*
						setInterval(function () {
							console.log ("path: %s", path);
							zk.a_set(path, "Updated data version " + version, version, function (rc, error, stat) {
								//stat_cb
								version++;
								console.log ("Update data: %s", error);
							});
						}, 5000);
*/
        }
    });
});

