/* eslint-disable prefer-const */
import { sign, verify } from 'jsonwebtoken';

const genToken = async (data) => {
  let token;
  // generate new jwt token for register = Cliebt_ID , ROle_ID
  token = sign(
    {
      ...data,
    },
    process.env.ENCRYPT_ID,
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

export const decodeRegToken = async (token) => {
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
