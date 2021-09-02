const Joi = require("joi");

const login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  next();
};

const register = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    asset_class: Joi.string().required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error);
    return;
  }
  next();
};

module.exports = { login, register };
