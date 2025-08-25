


export const generateRandomString = (length: number) => {
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     let result = '';
     const charactersLength = characters.length;
   
     // Loop 'length' times to build the string
     for (let i = 0; i < length; i++) {
       // Generate a random index and append the character at that index to the result
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
   
     return result;
   }
   