### Pre-requisites

- Make sure that you have node (>=20.0.0 <21.0.0) install 

- Install dependencies:

   ```bash
   $ npm install
   ```

- Create `.env`
   ```
   PORT=3000
   ```

1. **Plain Node.js Callbacks**

   - File: `src/plainServer.js`

   ```bash
   npm run start:plain
   ```

2. **Async Library**

   - File: `src/asyncServer.js`

   To run:

   ```bash
   npm run start:async
   ```

3. **Promises**

   - File: `src/primiseServer.js`

   To run:

   ```bash
   npm run start:promises
   ```

4. **Rxjs library**

   - File: `src/rxjsServer.js`

   To run:

   ```bash
   npm run start:rxjs
   ```

### Usage

Once the server is running, you can make requests to the following endpoint to fetch website titles:

- **Endpoint:** `/I/want/title`

  **Example requests:**

  - Single address: `http://localhost:3000/I/want/title?address=google.com`
  - Multiple addresses: `http://localhost:3000/I/want/title?address=google.com&address=yahoo.com`
