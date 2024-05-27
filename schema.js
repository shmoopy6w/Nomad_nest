// joi is used for server-side validation
//for client side validation we used 
// forms and also handles separate errors

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
         description : Joi.string().required(),
        location: Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("" , null)
        //image can be empty and we can also send null value to it

    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
            rating : Joi.number().required().min(1).max(5),
            comment : Joi.string().required(),
        }).required(),
});