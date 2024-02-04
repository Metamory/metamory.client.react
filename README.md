# metamory.client.react
Reference implementation for managing the content in a Metamory store

### Prerequisites:
Access to a running [Metamory-Server](https://github.com/Metamory/Metamory)-server.  
You can start one locally using docker:
``` bash
docker pull aeinbu/metamory
docker run -d -p 5000:5000 -v metamory-demo-data:/data \
  -e NoAuth=true \
  --name metamory-demo-server aeinbu/metamory
```

- While you are developing, you should leave the `serviceBaseUrl` attribute
in [src/App.tsx](src/App.tsx) empty, and set the `proxy` property in [package.json](package.json) to point to URL of the Metamory server. The development server will proxy all calls to Metamory server for you without the need of setting up CORS.
- When putting this to production, you should set the `serviceBaseUrl` attribute
in [src/App.tsx](src/App.tsx) to point to the URL of the Metamory server
    - If the Metamory is running on another domain than the app itself, you must enable CORS both on the server and in the app.

### How to use:
```shell
npm install
npm start
```
Navigate to http://localhost:3000

## License
This package is published under the MIT License. (See LICENSE file for more info)