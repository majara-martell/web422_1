/*******************************************************************************
* * WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Matias Alejandro Jara Martell Student ID: 151838232 Date: 2025-05-27
*
* Published URL: ___________________________________________________________
*
********************************************************************************/
const express = require('express');
const cors = require('cors');

require('dotenv').config(); // Load variables from .env
const ListingsDB = require("./modules/listingDB.js");
const db = new ListingsDB();

const mongoose = require('mongoose');

const app = express();
const HTTP_PORT = 3000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

/* app.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
}); */

app.post("/api/listings", async (req, res) => {
  try {
    const listing = await db.addNewListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Failed to create listing", error: err.message });
  }
});

app.get("/api/listings", async (req, res) => {
  const { page, perPage, name } = req.query;
  try {
    const listings = await db.getAllListings(parseInt(page), parseInt(perPage), name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (listing) res.json(listing);
    else res.status(404).json({ message: "Listing not found" });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving listing", error: err.message });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.updateListingById(req.body, req.params.id);
    if (result) {
       res.json({ message: "Listing updated successfully" });
    } else {
      res.status(404).json({ error: "Listing not found or not updated" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.deleteListingById(req.params.id);
    if (result) {
      res.status(204).end();//nothing(succssful deletion)
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
