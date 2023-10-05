const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"], // required input, not persistance to DB
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      // unique: true,
      required: [true, "A user must have an email"],
      lowerCase: true,
      validate: [validator.isEmail, "email doesnt follow the format"],
    },
    phone: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "phone number doesnt follow the format",
      ],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide a password"],
      select: false,
    },
    passwordConfirmation: {
      type: String,
      trim: true,
      required: [true, "Please type the password again"],
      validate: {
        validator: function (passwordConfirmed) {
          // this only works on save and create!!!
          return passwordConfirmed === this.password;
        },
        message: `Passwords don't match!`,
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirmation = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  currentPassword,
  storedPassword
) {
  return await bcrypt.compare(currentPassword, storedPassword);
};

module.exports = mongoose.model("Users", userSchema);
