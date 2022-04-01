# PWA DEMO

## Steps to install

1. Copy environment file
   <br/><br/>
    Execute the next command:
    
    ```shell
    cp .env.example .env.dev
    ```
    <br/><br/>
2. Up the docker container
    <br/><br/>
    Execute the next command:
    ```shell
    docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d
    ```
    <br/><br/>
3. Open browser
   <br/><br/>
    By default, the app is served in [localhost:8080](http://localhost:8080)

    <br/><br/>
## Notes

### Down Container

To down the docker container execute
```shell
docker-compose -f docker-compose.dev.yml --env-file .env.dev down
```