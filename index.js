const express = require("express");
const app = express();
const port = 8080;


app.listen(port, (req)=>{
  console.log("server started at port localHost:",port);
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
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

 app.get("/anime/:id", async (req,res)=>{
    const id=  req.params.id;
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const choosenanime = await response.json();
    res.render('choosen', { choosenanime: choosenanime.data });
 });
