## Try it out!

[Install Docker](https://www.docker.com/products/overview), then run

```
docker build -t clozedforbusiness github.com/jsoendermann/ClozedForBusiness
docker run -d -p 8730:8730 clozedforbusiness
open http://localhost:8730
```