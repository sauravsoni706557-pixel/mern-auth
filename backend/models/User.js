import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Jab refresh token generate hota hai, hum uska hash yaha store karte hain
    // taaki logout ya token-reuse-detection ke time isko invalidate kar sakein
    refreshTokenHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Save hone se pehle password ko hash karo (agar modify hua ho)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Login ke time plain password ko hash se compare karne ka method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
