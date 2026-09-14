const express = require("express");
const app = express()
const port = 3000

app.get('/', (req, res) => {
    console.log(req.query.link);

    if (!req.query.link) {
        res.status(404).send("Must send link query param");
        return;
    }

    const link = decodeURIComponent(req.query.link);
    fetch(link)
        .then(async (upstreamResponse) => {
            const contentType = upstreamResponse.headers.get('content-type');

            if (contentType) {
                res.setHeader('content-type', contentType);
            }

            const body = Buffer.from(await upstreamResponse.arrayBuffer());
            res.status(upstreamResponse.status).send(body);
        })
        .catch((error) => {
            res.status(502).type('text/plain').send(error instanceof Error ? error.message : String(error));
        })
})

app.listen(port, "0.0.0.0", () => {
   console.log(`Example app listening on port ${port}`);
})