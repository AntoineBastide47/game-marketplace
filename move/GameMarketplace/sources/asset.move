module game_marketplace::asset;

use game_marketplace::game;
use std::string;

const ASSET_WRONG_GAME: u64 = 1;
const ASSET_NOT_OWNER: u64 = 2;
const ASSET_INVALID_COUNT: u64 = 3;
const ASSET_INVALID_PRICE: u64 = 4;
const ASSET_EMPTY_NAME: u64 = 5;
const ASSET_EMPTY_DESCRIPTION: u64 = 6;
const ASSET_EMPTY_URL: u64 = 7;
const ASSET_INSUFFICIENT_SUPPLY: u64 = 8;

const ASSET_INFINITE: u64 = 18446744073709551615;

fun is_infinite(n: u64): bool { n == ASSET_INFINITE }

#[allow(unused_field)]
public struct MetaData has copy, drop, store {
    name: string::String,
    value: string::String,
}

public struct Asset has key, store {
    id: UID,
    name: string::String,
    description: string::String,
    imageUrl: string::String,
    count: u64,
    price: u64,
    gameId: ID,
    gameOwner: address,
    metaData: vector<MetaData>,
    renderingMetaData: vector<MetaData>,
}

public fun id(_asset: &Asset): ID { object::id(_asset) }

public fun name(_asset: &Asset): &string::String { &_asset.name }

public fun description(_asset: &Asset): &string::String { &_asset.description }

public fun count(_asset: &Asset): &u64 { &_asset.count }

public fun price(_asset: &Asset): &u64 { &_asset.price }

public fun gameId(_asset: &Asset): ID { _asset.gameId }

public fun gameOwner(_asset: &Asset): address { _asset.gameOwner }

#[allow(lint(self_transfer))]
public fun create_asset(
    _name: vector<u8>,
    _description: vector<u8>,
    _imageUrl: vector<u8>,
    _count: u64,
    _price: u64,
    _gameId: ID,
    _gameOwner: address,
    _metaData: vector<MetaData>,
    _renderingMetaData: vector<MetaData>,
    ctx: &mut TxContext,
) {
    let name = string::utf8(_name);
    assert!(!string::is_empty(&name), ASSET_EMPTY_NAME);

    let description = string::utf8(_description);
    assert!(!string::is_empty(&description), ASSET_EMPTY_DESCRIPTION);

    let imageUrl = string::utf8(_imageUrl);
    assert!(!string::is_empty(&imageUrl), ASSET_EMPTY_URL);

    assert!(_count == ASSET_INFINITE || _count > 0, ASSET_INVALID_COUNT);
    assert!(_price > 0, ASSET_INVALID_PRICE);

    let asset = Asset {
        id: object::new(ctx),
        name: name,
        description: description,
        imageUrl: imageUrl,
        count: _count,
        price: _price,
        gameId: _gameId,
        gameOwner: _gameOwner,
        metaData: _metaData,
        renderingMetaData: _renderingMetaData
    };

    transfer::public_transfer(asset, tx_context::sender(ctx));
}

fun check_permissions(_game: &game::Game, _asset: &mut Asset, ctx: &TxContext) {
    assert!(game::id(_game) == _asset.gameId, ASSET_WRONG_GAME);
    assert!(game::owner(_game) == tx_context::sender(ctx), ASSET_NOT_OWNER);
}

public fun set_price(_game: &game::Game, _asset: &mut Asset, _newPrice: u64, ctx: &mut TxContext) {
    check_permissions(_game, _asset, ctx);
    assert!(_newPrice > 0, ASSET_INVALID_PRICE);
    _asset.price = _newPrice;
}

public fun set_description(
    _game: &game::Game,
    _asset: &mut Asset,
    _description: vector<u8>,
    ctx: &mut TxContext,
) {
    check_permissions(_game, _asset, ctx);
    let description = string::utf8(_description);
    assert!(!string::is_empty(&description), ASSET_EMPTY_DESCRIPTION);
    _asset.description = description;
}

public fun set_name(
    _game: &game::Game,
    _asset: &mut Asset,
    _name: vector<u8>,
    ctx: &mut TxContext,
) {
    check_permissions(_game, _asset, ctx);
    let name = string::utf8(_name);
    assert!(!string::is_empty(&name), ASSET_EMPTY_NAME);
    _asset.name = name;
}

public fun set_metadata(
    _game: &game::Game,
    _asset: &mut Asset,
    _metaData: vector<MetaData>,
    ctx: &mut TxContext,
) {
    check_permissions(_game, _asset, ctx);
    _asset.metaData = _metaData
}

public fun set_rendering_metadata(
    _game: &game::Game,
    _asset: &mut Asset,
    _metaData: vector<MetaData>,
    ctx: &mut TxContext,
) {
    check_permissions(_game, _asset, ctx);
    _asset.renderingMetaData = _metaData
}

public fun increase_by(_game: &game::Game, _asset: &mut Asset, _amount: u64, ctx: &mut TxContext) {
    check_permissions(_game, _asset, ctx);
    assert!(_amount > 0, ASSET_INVALID_COUNT);
    if (!is_infinite(_asset.count)) {
        _asset.count = _asset.count + _amount;
    }
}

public fun can_mint(_asset: &Asset, _amount: u64): bool {
    _amount > 0 && (is_infinite(_asset.count) || _asset.count >= _amount)
}

public fun consume_supply(_asset: &mut Asset, _amount: u64) {
    assert!(_amount > 0, ASSET_INVALID_COUNT);
    if (!is_infinite(_asset.count)) {
        assert!(_asset.count >= _amount, ASSET_INSUFFICIENT_SUPPLY);
        _asset.count = _asset.count - _amount;
    }
}

public fun transfer_asset(_asset: Asset, _newOwner: address) {
    transfer::public_transfer(_asset, _newOwner);
}
