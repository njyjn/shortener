import { JwksClient } from "jwks-rsa";
import jwt from "jsonwebtoken";

const client = new JwksClient({
  jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
});

export function getKey(
  header: jwt.JwtHeader,
  callback: (err: Error | null, key?: string | Buffer) => void,
) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err || !key) {
      console.log(`Unable to retrieve signing key: ${err}`);
      callback(new Error("Unable to retrieve signing key"));
      return;
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyToken = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Failed to verify token: Invalid auth header");
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        console.log(`Failed to verify token: ${err}`);
        reject(new Error("Unauthorized"));
      } else {
        resolve(decoded);
      }
    });
  });
};
