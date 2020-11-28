/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import { sign, verify } from 'jsonwebtoken';

const Encryp = 'hvhvhwvwhecvhjwvlwvwhfvhjvhvhjvbwbwcjbgfwhbflvfwbsjvwflwjflhsvhvwajnvslnvwlvshsnvwhjcjafbkjfbwefsvjsbvbsvbvsbvjvbjvhchcshvcshzhsjvjvjvbjsbvjvbksjbvjfbvsjvbsvbsfvbjvbakjcbskjvbsvbbsjbvjsbvjvbsdvbjsvbjdsbvJBVksvbvkbvvzkvzkvVNKZnkbLSBNKSbkxBNvSLK';
const genToken = async (data) => {
  let token;
  // generate new jwt token for register = Cliebt_ID , ROle_ID
  token = sign(
    {
      ...data,
    },
    Encryp,
    {
      expiresIn: '7d',
    }
  );
  return token;
};

export const signToken = async (data) => {
  const token = await genToken({
    ...data,
  });

  return token;
};

export const decodeRegTokens = async (token) => {
  try {
    const decodedvalue = await verify(token, process.env.ENCRYPT_ID);
    const returnValue = {
      invalid: false,
      decodedvalue,
    };
    return returnValue;
  } catch (err) {
    return { invalid: true };
  }
};

export const decodeRegToken = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const decodedvalue = await verify(token, process.env.ENCRYPT_ID);
    const returnValue = {
      invalid: false,
      decodedvalue,
    };
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized User');
  }
};
