function generateUniqueUID(length) {
  
    return (
      "UID_" +
      Math.random()
        .toString(36)
        .substring(2, 2 + length)
        .toUpperCase()
    );
  }
module.exports=generateUniqueUID 