const Joi = require("joi");

const createTest = (req, res, next) => {
  const schema = Joi.object({
    subject: Joi.string().min(3).max(5).required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  next();
};

const getResult = (req, res, next) => {
  const schema = Joi.array();

  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  next();
};

module.exports = { createTest, getResult };
