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
      callback(new Error("Unable to retrieve signing key"));
      return;
    }

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyToken = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];

  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        reject(new Error("Unauthorized"));
      } else {
        resolve(decoded);
      }
    });
  });
};
