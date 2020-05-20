## Try it out!

[Install Docker](https://www.docker.com/products/overview), then run

```
docker build --tag clozedforbusiness github.com/jsoendermann/ClozedForBusiness
docker run --rm --publish 8730:8730 --name clozedforbusiness clozedforbusiness
```

and once the container is running, open http://localhost:8730
