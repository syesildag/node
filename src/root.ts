//validate(schema, documentNode);
// This class implements the RandomDie GraphQL type
class RandomDie {

   constructor(public numSides: number) {
   }

   rollOnce() {
      return 1 + Math.floor(Math.random() * this.numSides);
   }

   roll({ numRolls }: any) {
      var output = [];
      for (var i = 0; i < numRolls; i++)
         output.push(this.rollOnce());
      return output;
   }
}

// The root provides the top-level API endpoints
const rootValue = {
   getDie({ numSides }: any) {
      return new RandomDie(numSides || 6);
   },
};

export default rootValue;