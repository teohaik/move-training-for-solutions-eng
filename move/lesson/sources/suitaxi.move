module suitaxi::taxi {

    use std::string::{Self, String};

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::package;
    use sui::display;

    struct TaxiCub has key, store {
        id: UID,
        plate: String,
        color: String
    }

    struct TAXI has drop{}

    fun init(otw: TAXI, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        //All available names are defined here:
        //https://docs.sui.io/testnet/build/sui-object-display
        let keys : vector<String> = vector[
            string::utf8(b"description"),
            string::utf8(b"type"),
            string::utf8(b"image_url"),
        ];

        let values : vector<String> = vector[
            string::utf8(b"Taxi Cub with Plate Number: [{plate}] and Color: [{color}]"),
            string::utf8(b"Taxi"),
            string::utf8(b"https://www.pngall.com/wp-content/uploads/2016/07/Taxi-Cab-Free-Download-PNG.png"),
        ];

        let display = display::new_with_fields<TaxiCub>(&publisher, keys, values, ctx);
        display::update_version<TaxiCub>(&mut display);

        transfer::public_transfer(display, tx_context::sender(ctx));
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