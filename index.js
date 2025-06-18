const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
app.set("views", path.join(__dirname, "views"));


app.listen(port, (req)=>{
  console.log("server started at port localHost:",port);
});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", async (req, res) => {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?limit=15`);
    const anime = await response.json();
  res.render("index",{anime});
});

app.get("/search", async (req,res)=>{
    const query = req.query.q;
    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
 try{ 
        const res1 = await fetch(url);
        const res2 = await res1.json();
        res2.data.sort((a, b) => b.score - a.score);
        res.render("result" ,{anime:res2,query});
   }
 catch(error){
        res.status(500).send("Something get wrong");
   }
 });

 // app.get("/anime/:id", async (req,res)=>{
 //    const id=  req.params.id;
 //    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
 //    const data = await response.json();
 //    res.render("choosen.ejs", { choosenanime: data.data });
 // });

app.get("/anime/:id", async (req, res) => {
    const id = req.params.id;
    
    // Debug: Log the ID to see what we're getting
    console.log("Anime ID received:", id);
    
    try {
        const apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
        console.log("API URL:", apiUrl);
        
        const response = await fetch(apiUrl);
        
        // Check if the response is okay
        if (!response.ok) {
            console.log("API Response Status:", response.status);
            return res.status(404).send("Anime not found");
        }
        
        const data = await response.json();
        console.log("API Response received:", data);
        
        // Check if data exists
        if (!data.data) {
            console.log("No anime data found");
            return res.status(404).send("Anime not found");
        }
        
        res.render('choosen', { choosenanime: data.data });
        
    } catch(error) {
        console.error("Error fetching anime:", error);
        res.status(500).send("Something went wrong: " + error.message);
    }
});
