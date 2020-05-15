## Try it out!

[Install Docker](https://www.docker.com/products/overview), then run

```
docker build --tag clozedforbusiness github.com/jsoendermann/ClozedForBusiness
docker run --detach --publish 8730:8730 --name clozedforbusiness clozedforbusiness
open http://localhost:8730
```

and to stop

```
docker stop clozedforbusiness
```
