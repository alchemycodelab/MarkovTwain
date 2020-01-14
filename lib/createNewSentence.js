

module.exports = function createNewSentence(markov) {
  let generatedSentence = markov.makeSentence({ tries: 100 });
  while (generatedSentence.length > 280) {
    generatedSentence = markov.makeSentence();
  }

  return generatedSentence;
};