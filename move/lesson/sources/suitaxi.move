module suitaxi::taxi {

    use std::string::{String};

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::package;

    struct TaxiCub has key, store {
        id: UID,
        plate: String,
        color: String
    }

    struct TAXI has drop{}

    fun init(otw: TAXI, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    public entry fun new_taxi(plate:String, color: String, ctx: &mut TxContext) {
        let aTaxi = TaxiCub {
            id: object::new(ctx),
            plate: plate,
            color: color
        };
        transfer::public_transfer(aTaxi, tx_context::sender(ctx));
    }

    public fun get_new_taxi(plate:String,
                            color: String,
                            ctx: &mut TxContext): TaxiCub {
        TaxiCub {
            id: object::new(ctx),
            plate,
            color
        }
    }

    public entry fun modify_taxi_color(aTaxi: &mut TaxiCub, newColor: String) {
        aTaxi.color = newColor;
    }

    public entry fun modify_taxi_plate(aTaxi: &mut TaxiCub, newPlate: String) {
        aTaxi.plate = newPlate;
    }

    public entry fun delete_taxi(aTaxi: TaxiCub) {
        let TaxiCub { id: _id, plate: _, color: _ } = aTaxi;
        object::delete(_id);
    }

}