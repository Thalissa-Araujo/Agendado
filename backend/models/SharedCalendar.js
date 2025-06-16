const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SharedCalendar = sequelize.define('SharedCalendar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Professionals',
      key: 'id'
    }
  },
  sharedWithId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Professionals',
      key: 'id'
    }
  },
  permissionLevel: {
    type: DataTypes.ENUM('view', 'edit'),
    defaultValue: 'view'
  }
});

module.exports = SharedCalendar;