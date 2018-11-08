import express from "express";
import consign from "consign";
import body_parser from "body-parser";

let app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));

consign().include("src/resources")
         .into(app);
         
export default app;
