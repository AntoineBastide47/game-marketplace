module game_marketplace::game;

use std::string;
use sui::event;

const GAME_EMPTY_NAME: u64 = 1;
const GAME_EMPTY_DESCRIPTION: u64 = 2;

public struct Game has key, store {
    id: UID,
    owner: address,
    name: string::String,
    description: string::String,
    imageUrl: string::String,
    pageUrl: string::String,
}

public fun id(_g: &Game): ID { object::id(_g) }

public fun name(_g: &Game): &string::String { &_g.name }

public fun description(_g: &Game): &string::String { &_g.description }

public fun imageUrl(_g: &Game): &string::String { &_g.imageUrl }

public fun pageUrl(_g: &Game): &string::String { &_g.pageUrl }

public fun owner(_g: &Game): address { _g.owner }

public struct GameCreated has copy, drop {
    game_id: ID,
    creator: address,
    name: string::String,
}

#[allow(lint(self_transfer))]
public fun create_game(
    _name: vector<u8>,
    _description: vector<u8>,
    _imageUrl: vector<u8>,
    _pageUrl: vector<u8>,
    ctx: &mut TxContext,
) {
    let name = string::utf8(_name);
    assert!(!string::is_empty(&name), GAME_EMPTY_NAME);

    let description = string::utf8(_description);
    assert!(!string::is_empty(&description), GAME_EMPTY_DESCRIPTION);

    let imageUrl = string::utf8(_imageUrl);
    let pageUrl = string::utf8(_pageUrl);

    let game = Game {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        name: name,
        description: description,
        imageUrl: imageUrl,
        pageUrl: pageUrl,
    };

    event::emit(GameCreated {
        game_id: object::id(&game),
        creator: tx_context::sender(ctx),
        name: game.name,
    });

    transfer::public_transfer(game, tx_context::sender(ctx))
}

#[allow(unused_variable)]
public fun burn_game(_game: Game) {
    let Game { id, owner, name, description, imageUrl, pageUrl } = _game;
    id.delete();
}

public fun set_owner(_game: &mut Game, _newOwner: address) {
    _game.owner = _newOwner
}

public fun transfer_game(_game: Game, _newOwner: address) {
    transfer::public_transfer(_game, _newOwner)
}

// Pour les tests uniquement
#[test_only]
public fun mk_game_for_test(
    name: vector<u8>,
    description: vector<u8>,
    imageUrl: vector<u8>,
    pageUrl: vector<u8>,
    ctx: &mut TxContext
    ): Game {
        Game {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            imageUrl: string::utf8(imageUrl),
            pageUrl: string::utf8(pageUrl),
        }
}
