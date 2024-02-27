
  exports.remove_stopwords = (str,msg) => {
   let res = []
   let words = str.split(' ')
    for(let i=0;i<words.length;i++) {
      let word_clean = words[i].split(".").join("")
       if(!msg.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '))
  };

  exports.remove_stopwordsDots = (str,msg) => {
    let res = []
    let words = str.split(' ')
    if(!msg.includes(words)) {
      res.push(words)
  }
     return(res.join(' '))
   };