"use strict";
module.exports = (sequelize, DataTypes) => {
  const cpu = sequelize.define(
    "cpu",
    {
      CPU_ID: DataTypes.INTEGER,
      Nom: DataTypes.STRING,
      Type: DataTypes.STRING,
      Socket: DataTypes.STRING,
      Chipset: DataTypes.STRING,
      Chipset_graphique: DataTypes.STRING,
      Frequence: DataTypes.STRING,
      Frequence_boost: DataTypes.STRING,
      Nb_coeur: DataTypes.INTERGER,
      Cache: DataTypes.STRING,
      Architecture: DataTypes.STRING,
      Overclocking: DataTypes.INTEGER,
    },
    {}
  );
  cpu.associate = function (models) {
    // associations can be defined here
  };
  return cpu;
};
