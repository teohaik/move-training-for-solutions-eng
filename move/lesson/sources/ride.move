module suitaxi::ride {
    use std::string::{String};

    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;

    use sui::dynamic_object_field as dof;

    //Constants
    const RideStatusNewRequest: u16 = 0;
    const RideStatusCounterQuoted: u16 = 1;
    const RideStatusRideAccepted: u16 = 2;
    const RideStatusSuccessfullyCompleted: u16 = 3;


    const ERiderAlreadyInRide: u64 = 0;
    const EDriverAlreadyInRide: u64 = 1;
    const EUserIsNotAssignedDriver: u64 = 2;
    const EUserIsNotAssignedDriverNorRider: u64 = 3;
    const EInvalidState: u64 = 4;
    const EWrongDriverForThisRide: u64 = 5;


    struct RideStorage has key, store {
        id: UID
    }

    struct Ride has key, store {
        id: UID,
        state: u16,
        rider: address,
        driver: address,
        initial_location: String, //format: LAT,LONG eg "12.123,12.123"
        final_location: String,
        distance: u64, //in meters
        duration: u64, //in minutes
    }

    struct RideCreatedEvent has drop, copy {
        ride_id: ID,
        rider: address,
        initial_location: String
    }

    fun init(ctx: &mut TxContext) {
        let rideStorage = RideStorage {
            id: object::new(ctx)
        };
        transfer::share_object(rideStorage);
    }

    public fun request_ride(ride_storage: &mut RideStorage, initial_location: String, ctx: &mut TxContext) {

        let ride_uid =  object::new(ctx);
        let rider = tx_context::sender(ctx);
        let ride = Ride {
            id: ride_uid,
            state: RideStatusNewRequest,
            rider: rider,
            driver: @0x0,
            initial_location,
            final_location: std::string::utf8(b""),
            distance: 0,
            duration: 0
        };

        event::emit(RideCreatedEvent {
            ride_id: object::id<Ride>(&ride),
            rider: tx_context::sender(ctx),
            initial_location
        });

        dof::add(
            &mut ride_storage.id,
            rider,
            ride
        );
    }

    public fun accept_ride(ride_storage: &mut RideStorage,
                            rider: address,
                            ctx: &mut TxContext) {
        let rideMut : &mut Ride = dof::borrow_mut(&mut ride_storage.id, rider);
        rideMut.driver = tx_context::sender(ctx);
        rideMut.state = RideStatusRideAccepted;
    }

    public fun end_ride(ride: &mut Ride, final_location:String, distance: u64, duration: u64, ctx: &mut TxContext) {  //sender = taxi driver
        assert!(ride.state == RideStatusRideAccepted, EInvalidState);
        assert!(ride.driver == tx_context::sender(ctx), EWrongDriverForThisRide);
        ride.final_location = final_location;
        ride.distance = distance;
        ride.duration = duration;
        ride.state = RideStatusSuccessfullyCompleted;
    }


}