const express = require("express");
const fs = require("fs");
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));

const filePath = "users.json";

app.get("/api/users", function(req, res){
    const content = fs.readFileSync(filePath,"utf8");
    const users = JSON.parse(content);
    res.send(users);
});

app.post("/api/users", jsonParser, function (req, res) {

    if(!req.body.name || !req.body.age) return res.sendStatus(400);
      
    const userName = req.body.name;
    const userAge = req.body.age;
    let user = {name: userName, age: userAge};
      
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
      
    const id = Math.max.apply(Math,users.map(o => o.id))
    user.id = !users.length ? 1 : id+1;
    users.push(user);
    data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
});

app.delete("/api/users/:id", function(req, res){
       
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    if(!users.some(u => u.id == id)){
        res.status(404).send();
        return;
    } else {
      const user = users.filter(u => u.id == id)[0];
      users = users.filter(u => u.id != id);
      data = JSON.stringify(users);
      console.log(users)
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
});

app.put("/api/users", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
      
    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
      
    let data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    let user;
    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(user){
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
});

app.listen(3000, function(){
});