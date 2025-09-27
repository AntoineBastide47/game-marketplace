module game_marketplace::asset;

use std::string;


const ASSET_INVALID_COUNT: u64 = 1;
const ASSET_INVALID_PRICE: u64 = 2;
const ASSET_EMPTY_NAME: u64 = 3;
const ASSET_EMPTY_DESCRIPTION: u64 = 4;

public struct Asset has key, store {
    id: UID,
    name: string::String,
    description: string::String,
    count: u64,
    price: u64,
    gameId: ID,
    gameOwner: address,
}

public fun id(_asset: &Asset): ID { object::id(_asset) }

public fun name(_asset: &Asset): &string::String { &_asset.name }

public fun description(_asset: &Asset): &string::String { &_asset.description }

public fun count(_asset: &Asset): &u64 { &_asset.count }

public fun price(_asset: &Asset): &u64 { &_asset.price }

public fun game_id(_asset: &Asset): &ID { &_asset.gameId }

#[allow(lint(self_transfer))]
public fun create_asset(
    _name: vector<u8>,
    _description: vector<u8>,
    _count: u64,
    _price: u64,
    _gameId: ID,
    _gameOwner: address,
    ctx: &mut TxContext,
) {
    let name = string::utf8(_name);
    let description = string::utf8(_description);

    assert!(_count > 0, ASSET_INVALID_COUNT);
    assert!(_price > 0, ASSET_INVALID_PRICE);
    assert!(!string::is_empty(&name), ASSET_EMPTY_NAME);
    assert!(!string::is_empty(&description), ASSET_EMPTY_DESCRIPTION);

    let asset = Asset {
        id: object::new(ctx),
        name,
        description,
        count: _count,
        price: _price,
        gameId: _gameId,
        gameOwner: _gameOwner,
    };
    transfer::public_transfer(asset, tx_context::sender(ctx));
}

public fun set_price(asset: &mut Asset, new_price: u64) {
    assert!(new_price > 0, ASSET_INVALID_PRICE);
    asset.price = new_price;
}

public fun set_description(asset: &mut Asset, new_description: vector<u8>) {
    let description = string::utf8(new_description);
    assert!(!string::is_empty(&description), ASSET_EMPTY_DESCRIPTION);
    asset.description = description;
}

public fun set_name(asset: &mut Asset, new_name: vector<u8>) {
    let name = string::utf8(new_name);
    assert!(!string::is_empty(&name), ASSET_EMPTY_NAME);
    asset.name = name;
}

public fun increase_count(asset: &mut Asset, amount: u64) {
    assert!(amount > 0, ASSET_INVALID_COUNT);
    asset.count = asset.count + amount;
}

public fun transfer_to(asset: Asset, recipient: address) {
    transfer::public_transfer(asset, recipient);
}
