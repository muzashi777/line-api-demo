const request = require("request");
const express = require("express");
const route = express.Router();
const con = require("./databaseConfig/databaseConfig");

route.post("/webhook", (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  reply(reply_token, msg);
  // let date = new Date().toDateString("en-US", { timeZone: "Asia/Bangkok" });
  let date = new Date();
  date.setHours(date.getHours() + 7);
  con.query(
    // "CREATE TABLE ?? (name VARCHAR(255), address VARCHAR(255))",
    // [msg],
    "INSERT INTO customers VALUES ( ?, ?)",
    [date, msg],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(err.code);
      } else {
        console.log("Insert Successfully");
        res.json("Create Taherokuble successfully");
      }
    }
  );
  // res.sendStatus(200);
});

function reply(reply_token, msg) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.CHANNEL_ACCESSTOKEN,
  };
  let body = null;
  if (msg !== "ขอตัง") {
    body = JSON.stringify({
      replyToken: reply_token,
      messages: [
        {
          type: "text",
          text: msg,
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "Message",
                  text: "Are u ready??",
                },
              },
            ],
          },
        },
      ],
    });
  } else {
    body = JSON.stringify({
      replyToken: reply_token,
      messages: [
        {
          type: "flex",
          altText: "This is a Flex Message",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  height: "sm",
                  action: {
                    type: "uri",
                    label: "Click me!!!",
                    uri: "https://financial-plan-demo.herokuapp.com/",
                  },
                },
              ],
            },
          },
        },
      ],
    });
  }

  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body: body,
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
    }
  );
}

module.exports = route;
