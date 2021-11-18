function watch(urls) {

    var noCacheHeaders = new Map();
    noCacheHeaders.set('pragma', 'no-cache');
    noCacheHeaders.set('cache-control', 'no-cache');

    var config = {
        method: 'GET',
        headers: noCacheHeaders
    };

    // Assumes that first loads have up to date mod-times
    let modTimes = new Map();

    urls.forEach(url => {
        fetch(url, config).then(r => {
            modTimes.set(url, r.headers.get('Last-Modified'));
        });
    });

    setInterval(() => {
        modTimes.forEach((currModTime, url) => {
            fetch(url, config).then(r => {
                let newModTime = r.headers.get('Last-Modified');
                if (newModTime !== currModTime) {
                    document.location.reload()
                }
            });
        })
    }, 100);
}

//watch(["/", "/sketch.js", "/autoreload.js"]);
