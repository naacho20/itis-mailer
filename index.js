var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var cors = require("cors");
let dotenv = require("dotenv");

dotenv.config();

var transport = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post("/send", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var content = `name: ${name} \n email: ${email} \n message: ${message} `;

  var mail = {
    from: name,
    to: process.env.MI_MAIL,
    subject: "Nueva consulta desde web personal",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(process.env.PORT || 5000);
