const express = require("express");
const electionRoute = express.Router();
const electionSchema = require("../model/electionSchema");
const partySchema = require("../model/partySchema");

electionRoute.post("/register", (req, res) => {
  electionSchema.create(req.body, (err, data) => {
    if (err) return err;
    else res.json(data);
  });
});

electionRoute.post("/login", (req, res) => {
  electionSchema.findOne(
    {
      aadharNo: req.body.aadharNo,
      password: req.body.password,
    },
    function (err, data) {
      if (err) {
        return err;
      } else {
        res.json(data);
      }
    }
  );
});

electionRoute.get("/", (req, res) => {
  electionSchema.find((err, data) => {
    if (err) return err;
    else res.json(data);
  });
});

electionRoute.route("/recordVote").post((req, res) => {
  electionSchema.findOne({ aadharNo: req.body.aadharNo }, function (err, data) {
    if (!data.voteStatus) {
      electionSchema.findOneAndUpdate(
        { aadharNo: req.body.aadharNo },
        { voteStatus: true },
        { new: true },
        (err, data) => {
          if (err) return err;
        }
      );
      partySchema.findOneAndUpdate(
        { name: req.body.party },
        { $inc: { votes: 1 } },
        (err, data) => {
          if (err) return err;
          else res.json(data);
        }
      );
    } else {
      res.status(201).send();
    }
  });
});

electionRoute.route("/home").get(async (req, res) => {
  const total = await electionSchema.find({ voteStatus: true }).count();

  const bjp = await partySchema.findOne({ name: "bjp" });
  const congress = await partySchema.findOne({ name: "congress" });
  const aap = await partySchema.findOne({ name: "aap" });
  const ncp = await partySchema.findOne({ name: "ncp" });
  const inld = await partySchema.findOne({ name: "inld" });

  res.status(200).json({
    total: total,
    bjp: bjp.votes,
    congress: congress.votes,
    aap: aap.votes,
    ncp: ncp.votes,
    inld: inld.votes,
  });
});

module.exports = electionRoute;
