
  exports.getArrayWithUniquesElements = (myArray) => {
        let hash = Object.create(null);
        let uniqueChars = [];
        myArray.forEach((c) => {
          var key = JSON.stringify(c);
          hash[key] = (hash[key] || 0) + 1;
          hash[key] >= 2 ? null : uniqueChars.push(c);
        });
        return uniqueChars;
   };