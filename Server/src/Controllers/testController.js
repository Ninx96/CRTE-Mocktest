const { MongoClient, ObjectId } = require("mongodb");

const readXlsxFile = require("read-excel-file/node");
const { getDatabase } = require("../Configs/mongoDb");

const create = async (req, res) => {
  let ques = [];
  let paper = [];
  try {
    const dbObject = await getDatabase();

    const result = await dbObject
      .collection("Questions")
      .aggregate([
        { $match: { asset_class: req.res.locals.asset_class } },
        { $project: { correct_option: false } },
        {
          $group: {
            _id: "$sub_section",
            question: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const result2 = await dbObject
      .collection("CaseStudy")
      .aggregate([
        { $match: { asset_class: req.res.locals.asset_class } },
        { $project: { correct_option: false } },
        {
          $group: {
            _id: "$case",
            item: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    result.forEach((item, index) => {
      const length = item.question.length;
      const random = Math.floor(Math.random() * length);
      const temp = item.question[random];
      ques.push(temp);
      paper.push({ _id: temp._id });
    });

    let rand = Math.floor(result2.length * Math.random());
    let sequence = 1;

    for (let index = 0; index < 10; index++) {
      var temp = result2[rand].item[index];
      if (sequence != temp.sequence) {
        rand = Math.floor(result2.length * Math.random());
        sequence++;
        temp = result2[rand].item[index];
      }
      ques.push(temp);
      paper.push({ _id: temp._id });
    }

    // Saving a Question Paper

    const history = await dbObject
      .collection("QuestionPapers")
      .aggregate([
        { $match: { user_id: ObjectId(req.res.locals._id) } },
        { $sort: { datetime: 1 } },
      ])
      .toArray();

    const newSet = {
      user_id: ObjectId(req.res.locals._id),
      datetime: Date(),
      asset_class: req.res.locals.asset_class,
      set: paper,
    };

    let exam_id;

    if (history.length < 5) {
      const { insertedId } = await dbObject
        .collection("QuestionPapers")
        .insertOne(newSet);

      exam_id = insertedId;
    } else {
      const { value } = await dbObject
        .collection("QuestionPapers")
        .findOneAndUpdate({ _id: ObjectId(history[0]._id) }, { $set: newSet });

      exam_id = value._id;
    }

    res.send({ valid: true, _id: exam_id, quesList: ques });
  } catch (error) {
    res.send({ valid: false, message: error.message });
  }
};

const markAnswer = async (req, res) => {
  const exam_id = ObjectId(req.body.exam_id);
  const question_id = ObjectId(req.body.question_id);
  const answer = req.body.answer;

  try {
    const dbObject = await getDatabase();

    const exam = await dbObject
      .collection("QuestionPapers")
      .findOne({ _id: exam_id });

    const index = exam.set.findIndex(
      (item) => item._id == req.body.question_id
    );
    exam.set.splice(index, 1, { _id: question_id, answer: answer });

    dbObject
      .collection("QuestionPapers")
      .findOneAndReplace({ _id: exam_id }, exam);

    res.send({ valid: true, message: "Answer Updated" });
  } catch (e) {
    res.send({ valid: false, message: e.message });
  }
};

const getResult = async (req, res) => {
  var incorrect = 0;
  var correct = 0;
  var marks = 0;
  const arrFilter = [];

  const exam_id = ObjectId(req.body.exam_id);

  try {
    const dbObject = await getDatabase();

    const { set } = await dbObject
      .collection("QuestionPapers")
      .findOne({ _id: exam_id });

    set.forEach((item) => {
      arrFilter.push(ObjectId(item._id));
    });

    const result = await dbObject
      .collection("Questions")
      .aggregate([
        {
          $unionWith: {
            coll: "CaseStudy",
            pipeline: [{ $project: { case: false, sequence: false } }],
          },
        },
        { $match: { _id: { $in: arrFilter } } },
        { $sort: { sub_section: 1 } },
      ])
      .toArray();

    result.forEach((item, index) => {
      item.selected_option = set[index].answer;
      if (item.correct_option == item.selected_option) {
        correct++;
        marks = marks + Number(item.marks);
        return;
      }
      if (item.selected_option) {
        incorrect++;
        marks = marks - 0.25;
      }
    });

    res.send({
      valid: true,
      correct: correct,
      incorrect: incorrect,
      marks: marks,
      questions: result,
    });
  } catch (e) {
    res.send({
      valid: false,
      message: e.message,
    });
  }
};

const getHistory = async (req, res) => {
  const user_id = ObjectId(req.res.locals._id);

  try {
    const dbObject = await getDatabase();

    const result = await dbObject
      .collection("QuestionPapers")
      .aggregate([
        { $match: { user_id: user_id } },
        { $project: { set: false } },
        { $sort: { datetime: -1 } },
      ])
      .toArray();

    res.send({ valid: true, data: result });
  } catch (error) {
    res.send({ valid: false, message: error.message });
  }
};

const upload = (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let questions = [];

      rows.forEach((row) => {
        questions.push({
          sub_category: row[0],
          asset_class: row[1],
          question: row[2],
          option_a: row[3],
          option_b: row[4],
          option_c: row[5],
          option_d: row[6],
          correct_option: row[7],
          marks: row[8],
        });
      });
      // MongoClient.connect(url, function (err, cluster) {
      //   if (err) throw err;
      //   const dbObject = cluster.db("MockTest");
      //   dbObject
      //     .collection("Questions")
      //     .insertMany(questions, function (err, result) {
      //       if (err) throw err;
      //       res.send(result);
      //       cluster.close();
      //     });
      // });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

module.exports = { create, upload, markAnswer, getResult, getHistory };
