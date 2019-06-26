module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // 테이블명은 users
    nickname : {
      type : DataTypes.STRING(20), // 20글자 이하
      allowNull : false,  // 필수 
    },
    userId : {
      type : DataTypes.STRING(20),
      allowNull : false,
      unique : true, // 고유한 값
    },
    password : {
      type : DataTypes.STRING(100),
      allowNull : false,
    },
  }, {
    charset : 'utf8',
    collate : 'utf8_general_ci', // 한글이 저장되게 하기 위해서 
    // tableName : 'posts', // 테이블명을 변경해줄수도 있다.
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post , { as : 'Posts'});
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through : 'Like', as : 'Liked' });

    // 같은 테이블을 belongsToMany할려면 foreignKey를 적어줘야한다.
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
  };

  return User;
};