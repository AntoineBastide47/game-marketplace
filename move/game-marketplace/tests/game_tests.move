#[test_only]
module game_marketplace::game_tests;

use game_marketplace::game;
use std::string;
use sui::test_scenario as ts;

const ALICE: address = @0xA11CE;
const BOB: address = @0xB0B;

#[test]
fun create_game_ok() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);
    game::create_game(b"Nom", b"Description", b"http://image", b"http://page", ts::ctx(&mut sc));
    ts::end(sc);
}

#[test, expected_failure(abort_code = game::GAME_EMPTY_NAME)]
fun create_game_ko_empty_name() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);
    game::create_game(b"", b"Description", b"http://image", b"http://page", ts::ctx(&mut sc));
    ts::end(sc);
}

#[test, expected_failure(abort_code = game::GAME_EMPTY_DESCRIPTION)]
fun create_game_ko_empty_desc() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);
    game::create_game(b"Nom", b"", b"http://image", b"http://page", ts::ctx(&mut sc));
    ts::end(sc);
}

#[test]
fun getters_ok() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let g = game::mk_game_for_test(
        b"Zelda",
        b"Aventure",
        b"http://img",
        b"http://page",
        ts::ctx(&mut sc),
    );

    let n = game::name(&g);
    let d = game::description(&g);
    let i = game::imageUrl(&g);
    let p = game::pageUrl(&g);

    assert!(string::as_bytes(n) == b"Zelda", 1001);
    assert!(string::as_bytes(d) == b"Aventure", 1002);
    assert!(string::as_bytes(i) == b"http://img", 1003);
    assert!(string::as_bytes(p) == b"http://page", 1004);

    game::burn_game(g);
    ts::end(sc);
}

#[test]
fun transfer_game_ok() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let mut g = game::mk_game_for_test(
        b"Nom",
        b"Description",
        b"http://image",
        b"http://page",
        ts::ctx(&mut sc),
    );
    game::set_owner(&mut g, BOB, ts::ctx(&mut sc));
    game::transfer_game(g, BOB);

    ts::end(sc);
}

#[test]
fun burn_game_ok() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let g = game::mk_game_for_test(
        b"Nom",
        b"Description",
        b"http://image",
        b"http://page",
        ts::ctx(&mut sc),
    );
    game::burn_game(g);

    ts::end(sc);
}

#[test, expected_failure(abort_code = game::GAME_NOT_OWNER)]
fun set_owner_fail_not_owner() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let mut g = game::mk_game_for_test(
        b"Nom",
        b"Description",
        b"http://image",
        b"http://page",
        ts::ctx(&mut sc),
    );
    // ALICE owns the game, but BOB tries to set the owner
    ts::next_tx(&mut sc, BOB);
    game::set_owner(&mut g, ALICE, ts::ctx(&mut sc));
    ts::end(sc);
}

#[test]
fun transfer_and_check_owner() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let mut g = game::mk_game_for_test(
        b"Nom",
        b"Description",
        b"http://image",
        b"http://page",
        ts::ctx(&mut sc),
    );
    game::set_owner(&mut g, BOB, ts::ctx(&mut sc));
    game::transfer_game(g, BOB);

    // Next tx as BOB, check that BOB is now the owner
    ts::next_tx(&mut sc, BOB);
    let g2 = ts::take_from_sender<game::Game>(&sc);
    assert!(game::owner(&g2) == BOB, 2001);

    game::burn_game(g2);
    ts::end(sc);
}

#[test]
fun create_game_long_strings() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let long_name = b"abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
    let long_desc =
        b"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    game::create_game(long_name, long_desc, b"http://image", b"http://page", ts::ctx(&mut sc));

    ts::end(sc);
}

#[test]
fun transfer_then_burn() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let mut g = game::mk_game_for_test(
        b"Nom",
        b"Description",
        b"http://image",
        b"http://page",
        ts::ctx(&mut sc),
    );
    game::set_owner(&mut g, BOB, ts::ctx(&mut sc));
    game::transfer_game(g, BOB);

    ts::next_tx(&mut sc, BOB);
    let g2 = ts::take_from_sender<game::Game>(&sc);
    game::burn_game(g2);

    ts::end(sc);
}

#[test, expected_failure]
fun double_burn_fails() {
    let mut sc = ts::begin(ALICE);
    ts::next_tx(&mut sc, ALICE);

    let g = game::mk_game_for_test(
        b"Nom",
        b"Description",
        b"http://image",
        b"http://page",
        ts::ctx(&mut sc),
    );
    game::burn_game(g);

    // Try to burn again (should fail, as the object is deleted)
    game::burn_game(g);

    ts::end(sc);
}
