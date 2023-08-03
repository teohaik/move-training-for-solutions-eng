import {
    Connection,
    Ed25519Keypair,
    fromB64,
    JsonRpcProvider,
    RawSigner,
    SuiEvent,
    TransactionBlock
} from "@mysten/sui.js";
import {
    ADMIN_ADDRESS,
    ADMIN_SECRET_KEY,
    DRIVER_SECRET_KEY,
    PACKAGE_ADDRESS,
    PUBLISHER_ID, RIDE_STORAGE,
    RIDER_SECRET_KEY,
    SUI_NETWORK
} from "./config";
import {getCoinsOfAddress} from "./examples/getCoinsOfAddress";

console.log("Connecting to SUI network: ", SUI_NETWORK);

let driverPrivateKeyArray = Uint8Array.from(Array.from(fromB64(DRIVER_SECRET_KEY!)));
const driverKeypair = Ed25519Keypair.fromSecretKey(driverPrivateKeyArray.slice(1));

const connection = new Connection({
    fullnode: SUI_NETWORK,
});
const provider = new JsonRpcProvider(connection);
const signer = new RawSigner(driverKeypair, provider);

console.log("Driver Address = ", driverKeypair.getPublicKey().toSuiAddress());


async function acceptRide(event: SuiEvent) {
    console.log("New Ride Requested: ", event.id);
    console.log("Retrieving Request Data...");
    await new Promise(r => setTimeout(r, 1000));

    const rideRequestedEvent: Record<string, any> = event.parsedJson!;

    const rider = rideRequestedEvent.rider;
    const ride_id = rideRequestedEvent.ride_id;
    const initial_location = rideRequestedEvent.initial_location;

    console.log("Rider = ", rider);
    console.log("Ride ID = ", ride_id);
    console.log("Initial Location = ", initial_location);

    console.log("Processing Ride...");
    await new Promise(r => setTimeout(r, 1000));

    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::ride::accept_ride`,
        arguments: [
            tx.object(RIDE_STORAGE),
            tx.object(rider)
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
    }).then((res) => {
        const status = res?.effects?.status.status;
        if (status == "success") {
            console.log("Driver accepted ride. Ride ID = ", ride_id);
        }
        if (status == "failure") {
            console.log("Error = ", res?.effects);
        }
    });


}

const listenForRideRequests = async () => {

    provider.subscribeEvent({
        filter: {
            MoveEventType: `${PACKAGE_ADDRESS}::ride::RideCreatedEvent`
        },
        onMessage(event: SuiEvent) {
            acceptRide(event);
        }
    }).then((subscriptionId) => {
        console.log("Subscriber subscribed. SubId = ", subscriptionId);
    });

}

listenForRideRequests();
