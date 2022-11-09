const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");

const jwtToken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const uuidv4 = uuid.v4;

const app = express();

// const whitelist = [
//   "http://localhost:3000",
//   "http://localhost:8080",
//   "https://shrouded-journey-38552.herokuapp.com",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("** Origin of request " + origin);
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       console.log("Origin acceptable");
//       callback(null, true);
//     } else {
//       console.log("Origin rejected");
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// if (process.env.NODE_ENV === "production") {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, "client/build")));
//   // Handle React routing, return all requests to React app
//   app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const PORT = process.env.PORT || 4000;

app.use(express.json());
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vishnuvamsi93@gmail.com",
    pass: "ieamooiupgkubdrl",
  },
});

let db = null;
const dbPath = path.join(__dirname, "server.db");

const initializeDbAndAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(PORT, () => {
      console.log(`server running at ${PORT}`);
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndAndServer();

const getUserDetails = async (request, response, next) => {
  const { email } = request.body;

  const sqlQuary = `select * from users where email="${email}" ; `;
  const dbResponse = await db.get(sqlQuary);

  if (dbResponse === undefined) {
    next();
  } else {
    response.status(400);
    response.send({ data: "email already exists" });
  }
};

const validateUser = async (request, response, next) => {
  const { email } = request.body;

  const sqlQuary = `select * from users where email="${email}" ; `;
  const dbResponse = await db.get(sqlQuary);

  if (dbResponse === undefined) {
    response.status(400);

    response.send({ data: "Invalid Email" });
  } else {
    const { email, id } = dbResponse;
    request.payLoad = { email, id };
    next();
  }
};

const getUserDetailsLogin = async (request, response, next) => {
  const { email, password } = request.body;

  const sqlQuary = `select * from users where email="${email}" ; `;
  const dbResponse = await db.get(sqlQuary);

  if (dbResponse === undefined) {
    response.status(400);
    response.send({ data: "Invalid Email" });
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      dbResponse.password
    );

    if (isPasswordMatched) {
      request.payLoad = { email: dbResponse.email, name: dbResponse.name };
      next();
    } else {
      response.status(400);
      response.send({ data: "Invalid Password" });
    }
  }
};

app.post("/register", getUserDetails, async (request, response) => {
  const id = uuidv4();
  const { name, email, mobileNo, password, place } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const sqlQuary = `insert into users (name,email,mobile_no,password,place,id)
  values("${name}","${email}",${mobileNo},"${hashedPassword}","${place}","${id}");`;

  const dbResponse = await db.run(sqlQuary);
  response.status(200);
  response.send({ data: "user added successfully" });
});

app.get("/register", async (request, response) => {
  const sqlQuary = `select * from users ; `;
  const dbResponse = await db.all(sqlQuary);
  if (dbResponse === undefined) {
    response.status(200);
    response.send(dbResponse);
  } else {
    response.status(200);
    response.send(dbResponse);
  }
});

app.post("/login", getUserDetailsLogin, async (request, response) => {
  const { payLoad } = request;

  const userJwtToken = jwtToken.sign(payLoad, "vamsi");
  response.status(200);
  response.send({ jwtToken: userJwtToken });
});

const getPlayloadDetails = (request, response, next) => {
  const verifyAuth = request.headers.authorization;

  if (verifyAuth === undefined) {
    response.status(400);
    response.send({ data: "invalid jwt toke" });
  } else {
    const userJwtToken = verifyAuth.split(" ")[1];

    if (userJwtToken === undefined) {
      response.status(400);
      response.send({ data: "invalid jwt toke" });
    } else {
      jwtToken.verify(userJwtToken, "vamsi", async (error, payLoad) => {
        if (error) {
          response.status(400);
          response.send({ data: "invalid jwt toke" });
        } else {
          request.payLoad = payLoad;
          next();
        }
      });
    }
  }
};

app.get("/users", getPlayloadDetails, async (request, response) => {
  const payLoad = request.payLoad;
  const { email } = payLoad;
  const sqlQuary = `select * from users where email="${email}";`;
  const dbResponse = await db.get(sqlQuary);
  if (dbResponse !== undefined) {
    response.status(200);
    response.send({ data: dbResponse });
  } else {
    response.status(400);
    response.send({ data: "invalid jwt toke" });
  }
});

app.put("/updateprofile", getPlayloadDetails, async (request, response) => {
  const payLoad = request.payLoad;
  const { name, mobileNo, place } = request.body;
  const { email } = payLoad;

  const sqlQuary = `update users set name="${name}",mobile_no=${mobileNo},place="${place}"
  where email="${email}" ;`;
  const dbResponse = await db.run(sqlQuary);
  response.status(200);
  response.send({ data: "details updated" });
});

app.post("/reset-password", validateUser, async (request, response) => {
  const { payLoad } = request;

  const { id, email } = payLoad;

  try {
    const token = jwtToken.sign(payLoad, "vamsi", {
      expiresIn: "300",
    });

    const sqlQuary = `update users set reset_token="${token}" where email="${email}";`;
    const dbResponse = await db.run(sqlQuary);

    if (dbResponse) {
      console.log("hi");
      const mailOptions = {
        from: "vishnuvamsi93@gmail.com",
        to: email,
        subject: "Sending Email For password Reset",
        text: `This Link Valid For 5 MINUTES http://localhost:3000/forgot-password/${id}/${token}`,
      };
      console.log(email);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          response.status(400);
          response.send({ data: "failed to access requested email" });
        } else {
          console.log("Email sent", info.response);
          response.status(200);
          response.send({ data: "link sent to requested email" });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/forgotpassword/:id/:token", async (request, response) => {
  const { id, token } = request.params;
  const { password } = request.body;

  const sqlQuary = `select * from users where id="${id}";`;
  const dbResponse = await db.get(sqlQuary);
  if (dbResponse === undefined) {
    console.log(1);
    request.status(400);
    response.send({ data: "Invalid user crediential" });
  }
  jwtToken.verify(token, "vamsi", async (error, payLoad) => {
    if (error) {
      console.log(2);
      response.status(400);
      response.send({ data: "invalid  token" });
    } else {
      const quary = `update users set password="${password}" where id="${id}";`;
      const updateState = await db.run(quary);
      if (updateState) {
        response.status(200);
        response.send({ data: "Password updated successfully" });
      }
    }
  });
});
