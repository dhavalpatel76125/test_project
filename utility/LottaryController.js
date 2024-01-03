function generateLotteryResult() {
  const sizes = ['small', 'big'];
  const colors = ['red', 'green'];
  const extra = ['yellow'];
  const randomNumber = Math.floor(Math.random() * 10);

  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomcolor = colors[Math.floor(Math.random() * colors.length)];

  let result = {
      color: [randomcolor],
      number: randomNumber,
      size: randomSize,
  };

  // Check if the randomcolor is red or green

      // There's an additional chance for yellow
      const includeYellow = Math.random() < 0.5; // Adjust the probability as needed

      if (includeYellow) {
          result.color.push('yellow'); // Overwrite the original color
      }
  

  return result;
}

// Example usage
const lotteryResult = generateLotteryResult();

  
module.exports.generateLotteryResult = generateLotteryResult
  