// export default (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);

//     if (error) {
//       const message = `Data validation was unsuccessful: ${error.details[0].message}`;
//       return res.status(400).json({ message });
//     }

//     return next();
//   };
// };

//  if (error) {
//       const message = `Data validation was unsuccessful: ${error.details[0].message}`;
//       return res.status(400).json({ message });
//     }

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    req.body = value;

    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    req.params = value;

    next();
  };
};
