module teober::teober_taxi {

    use std::string::{Self, String};  //first try it without Adding the Self

    use sui::object::{Self, UID};     //first try it without Adding the Self
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::display;
    use sui::package;

    struct TaxiCab has key, store{
        id: UID,
        plate: String,
        color: String
    }

    struct TEOBER_TAXI has drop {}

    fun init(otw: TEOBER_TAXI, ctx: &mut  TxContext){
        let aTaxi = TaxiCab {
            id: object::new(ctx),
            plate: string::utf8(b"AB1234"),
            color: string::utf8(b"Grey")
        };

        let publisher = package::claim(otw, ctx);

        let keys: vector<String> = vector[
            string::utf8(b"description"),
            string::utf8(b"type"),
            string::utf8(b"image_url")
        ];

        let values: vector<String> = vector[
            string::utf8(b"Taxi Cab with plate Number {plate} and {color} color"),
            string::utf8(b"Taxi Cab"),
            string::utf8(b"https://www.pngall.com/wp-content/uploads/2016/07/Taxi-Cab-Free-Download-PNG.png")
        ];

        let display = display::new_with_fields<TaxiCab>(&publisher, keys, values, ctx);
        display::update_version<TaxiCab>(&mut display);

        transfer::public_transfer(display, tx_context::sender(ctx));
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(aTaxi, tx_context::sender(ctx));  //first try it without setting the key ability
    }

    public entry fun new_taxi(plate: String, color: String, ctx: &mut TxContext) {
        let aTaxi = TaxiCab {
            id: object::new(ctx),
            plate,
            color
        };

        transfer::public_transfer(aTaxi, tx_context::sender(ctx));
    }

    public entry fun modify_taxi_color(taxi: &mut TaxiCab, color: String) {   //call it multiple times to see how object state changes
        taxi.color = color;
    }

    public entry fun destroy_taxi(taxi: TaxiCab) {
        let TaxiCab  {id: _id, plate: _,color: _} = taxi;
        object::delete(_id);
    }

}