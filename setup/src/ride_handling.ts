import {Connection, Ed25519Keypair, fromB64, JsonRpcProvider, RawSigner, TransactionBlock} from "@mysten/sui.js";
import {
  ADMIN_ADDRESS,
  ADMIN_SECRET_KEY, DRIVER_SECRET_KEY,
  PACKAGE_ADDRESS,
  PUBLISHER_ID,
  RIDE_STORAGE,
  RIDER_SECRET_KEY,
  SUI_NETWORK
} from "./config";
import {getCoinsOfAddress} from "./examples/getCoinsOfAddress";

console.log("Connecting to SUI network: ", SUI_NETWORK);

let riderPrivateKeyArray = Uint8Array.from(Array.from(fromB64(RIDER_SECRET_KEY!)));
const riderKeypair = Ed25519Keypair.fromSecretKey(riderPrivateKeyArray.slice(1));


//Driver= 0xe38f0a24d71ab2f95dce41dad3268d5f7afdcc7e8430355938a691bd21188f2f
let driverPrivateKeyArray = Uint8Array.from(Array.from(fromB64(DRIVER_SECRET_KEY!)));
const driverKeypair = Ed25519Keypair.fromSecretKey(driverPrivateKeyArray.slice(1));

const connection = new Connection({
  fullnode: SUI_NETWORK,
});
const provider = new JsonRpcProvider(connection);


console.log("Rider Address = ", riderKeypair.getPublicKey().toSuiAddress());
console.log("Driver Address = ", driverKeypair.getPublicKey().toSuiAddress());

const requestRide = async ()  => {

  const signer = new RawSigner(riderKeypair, provider);

  const tx = new TransactionBlock();

  let rideId = tx.moveCall({
    target: `${PACKAGE_ADDRESS}::ride::request_ride`,
    arguments: [
      tx.object(RIDE_STORAGE),
      tx.pure("40.632598,22.943312")
    ]
  });

  tx.setGasBudget(1000000000);

  let res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEvents: true,
      showEffects: true,
      showObjectChanges: true,
      showBalanceChanges: true,
      showInput: true
    }
  });
  console.log(res);

}

requestRide();
