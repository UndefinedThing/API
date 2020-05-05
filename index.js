const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du server
const app = express();

// COnfiguration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de donnée SQlite
const db_name = path.join(__dirname, "data", "app.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connexion réussie à la base de données 'app.db'");
});

const sql_create = `
  CREATE TABLE IF NOT EXISTS CPU (
    CPU_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nom VARCHAR(100) NOT NULL,
    Type VARCHAR(100) NOT NULL,
    Socket VARCHAR(100) NOT NULL,
    Chipset VARCHAR(100) NOT NULL,
    Chipset_graphique INTERGER NOT NULL,
    Frequence VARCHAR(100) NOT NULL,
    Frequence_boost VARCHAR(100) NOT NULL,
    Nb_coeur INTERGER NOT NULL,
    Cache VARCHAR(100) NOT NULL,
    Architecture VARCHAR(100) NOT NULL,
    Overclocking INTEGER NOT NULL
  );
`;

db.run(sql_create, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("C'est bon table CPU créé");

  // database seeding
  const sql_insert = `
  INSERT INTO CPU (CPU_ID, Nom, Type, Socket, Chipset, Chipset_graphique, Frequence, Frequence_boost, Nb_coeur, Cache, Architecture, Overclocking) VALUES
  (1, 'Ryzen ThreadRipper 2820X', 'AMD', 'AMD TR4', 'AMD X299, X399', 1, '3.5 GHz', '4.3 GHz', 12, '32 Mo', 'AMD Zen+: 12nm', 1),
  (2, 'Intel Core i7-6700K','INTEL', 'Intel 1151', 'Intel Z170, H170, B150, H110, Q170, Z270, B250, H270, Q150' , 1, '4 Ghz', '4.2 GHz', 4, '8 Mo', 'Skylake: 14nm', 1)
  `;
  db.run(sql_insert, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Alimentation réussie de la table 'CPU'");
  });
});

app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/data", (req, res) => {
  const sql = "SELECT * FROM CPU ORDER BY Nom";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("data", { model: rows });
  });
});

app.get("/cpu", (req, res) => {
  const sql = "SELECT * FROM CPU ORDER BY Nom";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("cpu", { model: rows });
  });
});

// GET /edit/1
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM CPU WHERE CPU_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

// POST /edit/1
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const cpu = [
    req.body.Nom,
    req.body.Type,
    req.body.Socket,
    req.body.Chipset,
    req.body.Chipset_graphique,
    req.body.Frequence,
    req.body.Frequence_boost,
    req.body.Nb_coeur,
    req.body.Cache,
    req.body.Architecture,
    req.body.Overclocking,
    id,
  ];
  const sql =
    "UPDATE CPU SET Nom = ?, Type = ?, Socket = ? , Chipset = ? , Chipset_graphique = ?, Frequence = ?, Frequence_boost = ?, Nb_coeur = ?, Cache = ?, Architecture = ?, Overclocking = ? WHERE (CPU_ID = ?)";
  db.run(sql, cpu, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect("/cpu");
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql =
    "INSERT INTO CPU (Nom, Type, Socket, Chipset, Chipset_graphique, Frequence, Frequence_boost, nb_coeur, Cache, Architecture, Overclocking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const cpu = [
    req.body.Nom,
    req.body.Type,
    req.body.Socket,
    req.body.Chipset,
    req.body.Chipset_graphique,
    req.body.Frequence,
    req.body.Frequence_boost,
    req.body.Nb_coeur,
    req.body.Cache,
    req.body.Architecture,
    req.body.Overclocking,
  ];
  db.run(sql, cpu, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/cpu");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM CPU WHERE CPU_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM CPU WHERE CPU_ID = ?";
  db.run(sql, id, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/cpu");
  });
});

// Routes A JSON
app.get("/JSON/about", (req, res) => {
  res.json({
    contenu:
      "<h1>About My API</h1>    <p>Premiére API en express, sequelize, sqlite et nodejs</p>",
  });
});

app.get("/JSON/data", (req, res) => {
  const test = {
    title: "Test",
    items: ["one", "two", "three"],
  };
  res.json({ model: test });
});

app.get("/JSON/cpu", (req, res) => {
  const sql = "SELECT * FROM CPU ORDER BY Nom";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json({ model: rows });
  });
});

// GET /edit/1
app.get("/JSON/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM CPU WHERE CPU_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.json({ model: row });
  });
});

// POST /edit/1
app.post("/JSON/edit/:id", (req, res) => {
  const id = req.params.id;
  const cpu = [
    req.body.Nom,
    req.body.Type,
    req.body.Socket,
    req.body.Chipset,
    req.body.Chipset_graphique,
    req.body.Frequence,
    req.body.Frequence_boost,
    req.body.Nb_coeur,
    req.body.Cache,
    req.body.Architecture,
    req.body.Overclocking,
    id,
  ];
  const sql =
    "UPDATE CPU SET Nom = ?, Type = ?, Socket = ? , Chipset = ? , Chipset_graphique = ?, Frequence = ?, Frequence_boost = ?, Nb_coeur = ?, Cache = ?, Architecture = ?, Overclocking = ? WHERE (CPU_ID = ?)";
  db.run(sql, cpu, (err) => {
    if (err) {
      console.error(err.message);
    }
    res.json(cpu);
  });
});
