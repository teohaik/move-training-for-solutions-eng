import {Connection, Ed25519Keypair, fromB64, JsonRpcProvider, RawSigner, TransactionBlock} from "@mysten/sui.js";
import {ADMIN_ADDRESS, ADMIN_SECRET_KEY, PACKAGE_ADDRESS, PUBLISHER_ID, SUI_NETWORK} from "./config";
import {getCoinsOfAddress} from "./examples/getCoinsOfAddress";

console.log("Connecting to SUI network: ", SUI_NETWORK);

const adminSecretKey = ADMIN_SECRET_KEY;
let privateKeyArray = Uint8Array.from(Array.from(fromB64(adminSecretKey!)));
console.log(privateKeyArray);
const keypair = Ed25519Keypair.fromSecretKey(privateKeyArray.slice(1));

const run = async () => {
  const connection = new Connection({
    fullnode: SUI_NETWORK,
  });
  const provider = new JsonRpcProvider(connection);

  const signer = new RawSigner(keypair, provider);

  const tx = new TransactionBlock();

  let newTaxi = tx.moveCall({
    target: `${PACKAGE_ADDRESS}::taxi::get_new_taxi`,
    arguments: [
      tx.pure("ABC123_PROGRAMMABLE"),
      tx.pure("Blue")
    ]
  });

  tx.moveCall({
    target: `${PACKAGE_ADDRESS}::taxi::modify_taxi_color`,
    arguments: [
      newTaxi,
      tx.pure("Red")
    ]
  });




  let taxiDisplay = tx.moveCall({
    target: `0x2::display::new_with_fields`,
    arguments: [
      tx.object(PUBLISHER_ID),
      tx.pure(["description", "type", "image_url", "link"]),
      tx.pure([
        "Taxi Cub with Plate Number: [{plate}] and Color: [{color}]",
        "Programmable Taxi",
        "https://www.pngall.com/wp-content/uploads/2016/07/Taxi-Cab-Free-Download-PNG.png",
        "chaikalis.gr"
      ])
    ],
    typeArguments: [`${PACKAGE_ADDRESS}::taxi::TaxiCub`]
  });

  tx.moveCall({
    target: `0x2::display::update_version`,
    arguments: [taxiDisplay],
    typeArguments: [`${PACKAGE_ADDRESS}::taxi::TaxiCub`]
  });

  tx.transferObjects([taxiDisplay, newTaxi], tx.pure(ADMIN_ADDRESS));

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
run();
