# Response
## A. Required Information
### A.1. Requirement Completion Rate
- [x] List all pharmacies open at a specific time and on a day of the week if requested.
  - Implemented at API GET /pharmacies.
- [x] List all masks sold by a given pharmacy, sorted by mask name or price.
  - Implemented at API GET /pharmacies/{pharmacyId}/masks.
- [x] List all pharmacies with more or less than x mask products within a price range.
  - Implemented at API GET /pharmacies.
- [x] The top x users by total transaction amount of masks within a date range.
  - Implemented at API GET /users/top-buyers.
- [ ] The total number of masks and dollar value of transactions within a date range.
  - Implemented at API GET /transactions.
- [x] Search for pharmacies or masks by name, ranked by relevance to the search term.
  - Implemented at API GET /pharmacies.
- [ ] Process a user purchases a mask from a pharmacy, and handle all relevant data changes in an atomic transaction.
  - Implemented at API POST /users/{userId}/buy-masks.
### A.2. API Document
To view the list of available APIs and their specifications, run the server and go to http://localhost:3000/v1/docs in your browser. This documentation page is automatically generated using the swagger definitions written as comments in the route files.

### A.3. Import Data Commands
1. Copy the .env.example file and rename it to .env.
```bash
cp .env.example .env
```
2. Modify the .env file with your own configuration details.
3. Run the following command to migrate the database schema:
```bash
npm run migrate
```
This command will create the necessary tables in the database.
4. Use the following command to import pharmacies data:
```bash
npm run importPharmacies
```
This command will import pharmacies data from the specified source into the database.
5. Use the following command to import users data:
```bash
npm run importUsers
```
This command will import users data from the specified source into the database.
6. Finally, start the service by running the following command:
```bash
npm run dev
```
## B. Bonus Information
### B.1. Test Coverage Report
### B.2. Dockerized
### B.3. Demo Site Url
The demo site is ready on [aws](<https://35.78.119.147/v1/docs/>); you can try any APIs on this demo site.
