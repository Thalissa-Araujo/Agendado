const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Professional = sequelize.define('Professional', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deviceToken: {
    type: DataTypes.STRING
  },
  businessName: {
    type: DataTypes.STRING
  },
  businessAddress: {
    type: DataTypes.TEXT
  }
}, {
  instanceMethods: {
    comparePassword: function(candidatePassword) {
      return bcrypt.compareSync(candidatePassword, this.password);
    }
  }
});

module.exports = Professional;