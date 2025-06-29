const mongoose = require('mongoose');
 const Listing = require("../models/listing.js");
 const initData = require("./data.js");

main()
.then(()=>{
    console.log("mongo connected successfully");
})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB =  async() =>{
 await  Listing.deleteMany({});
 initData.data = initData.data.map((obj)=>({...obj,owner:"685b07aacade8c1491ee50e3"}));
 await Listing.insertMany(initData.data);
 console.log("data inserted successfully");
 }

 initDB();
