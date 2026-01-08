import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    default: '',
    maxlength: 50
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  profileImage: {
    type: String,
    default: ''
  },
  themeSettings: {
    mode: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    accentColor: {
      type: String,
      default: '#3b82f6'
    },
    font: {
      type: String,
      default: 'Inter'
    },
    buttonStyle: {
      type: String,
      enum: ['rounded', 'pill', 'square', 'sharp'],
      default: 'rounded'
    },
    backgroundType: {
      type: String,
      enum: ['solid', 'gradient'],
      default: 'solid'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    gradientFrom: {
      type: String,
      default: '#ffffff'
    },
    gradientTo: {
      type: String,
      default: '#f3f4f6'
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
