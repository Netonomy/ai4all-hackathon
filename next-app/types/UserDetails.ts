// interface PublicKey {
//   id: string;
//   type: string;
//   publicKeyJwk: {
//     kty: string;
//     crv: string;
//     x: string;
//     y: string;
//   };
//   purposes: string[];
// }

// interface Recovery {
//   publicJwk: {
//     kty: string;
//     crv: string;
//     x: string;
//     y: string;
//   };
//   privateJwk: {
//     kty: string;
//     crv: string;
//     x: string;
//     y: string;
//     d: string;
//   };
// }

// interface Update {
//   publicJwk: {
//     kty: string;
//     crv: string;
//     x: string;
//     y: string;
//   };
//   privateJwk: {
//     kty: string;
//     crv: string;
//     x: string;
//     y: string;
//     d: string;
//   };
// }

// interface Ops {
//   operation: string;
//   content: {
//     publicKeys: PublicKey[];
//   };
//   recovery: Recovery;
//   update: Update;
// }

// interface UserDetails {
//   ops: Ops[];
// }

interface UserDetails {
  did: string;
}
