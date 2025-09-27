// tests/game_tests.move
#[test_only]
module game_marketplace::game_tests {
    use std::string;
    use sui::test_scenario as ts;
    use game_marketplace::game;

    // --- create_game : cas OK ---
    #[test]
    fun create_game_ok() {
        let mut sc = ts::begin(@0xA11CE);    // sender initial = Alice
        ts::next_tx(&mut sc);                // nouvelle tx signée par Alice
        game::create_game(
            b"Nom",
            b"Description",
            b"http://image",
            b"http://page",
            ts::ctx(&mut sc)
        );
    }

    // --- create_game : erreurs attendues ---
    #[test, expected_failure(abort_code = game::GAME_EMPTY_NAME)]
    fun create_game_ko_empty_name() {
        let mut sc = ts::begin(@0xA11CE);
        ts::next_tx(&mut sc);
        game::create_game(
            b"",                  // nom vide
            b"Description",
            b"http://image",
            b"http://page",
            ts::ctx(&mut sc)
        );
    }

    #[test, expected_failure(abort_code = game::GAME_EMPTY_DESCRIPTION)]
    fun create_game_ko_empty_desc() {
        let mut sc = ts::begin(@0xA11CE);
        ts::next_tx(&mut sc);
        game::create_game(
            b"Nom",
            b"",                  // description vide
            b"http://image",
            b"http://page",
            ts::ctx(&mut sc)
        );
    }

    // --- mk_game_for_test + getters ---
    #[test]
    fun getters_ok() {
        let mut sc = ts::begin(@0xA11CE);
        ts::next_tx(&mut sc);

        let g = game::mk_game_for_test(
            b"Zelda",
            b"Aventure",
            b"http://img",
            b"http://page",
            ts::ctx(&mut sc)
        );

        let n = game::name(&g);
        let d = game::description(&g);
        let i = game::imageUrl(&g);
        let p = game::pageUrl(&g);

        assert!(string::as_bytes(n) == b"Zelda", 1001);       // as_bytes, pas bytes
        assert!(string::as_bytes(d) == b"Aventure", 1002);
        assert!(string::as_bytes(i) == b"http://img", 1003);
        assert!(string::as_bytes(p) == b"http://page", 1004);

        game::burn_game(g);   // consommer l'objet
    }

    // --- mk_game_for_test + transfer_game ---
    #[test]
    fun transfer_game_ok() {
        let mut sc = ts::begin(@0xA11CE);    // Alice est la signataire
        ts::next_tx(&mut sc);

        let g = game::mk_game_for_test(
            b"Nom",
            b"Description",
            b"http://image",
            b"http://page",
            ts::ctx(&mut sc)
        );

        // On transfère vers une adresse littérale (Bob). Pas besoin de changer de sender.
        game::transfer_game(g, @0xB0B);
    }

    // --- mk_game_for_test + burn_game ---
    #[test]
    fun burn_game_ok() {
        let mut sc = ts::begin(@0xA11CE);
        ts::next_tx(&mut sc);

        let g = game::mk_game_for_test(
            b"Nom",
            b"Description",
            b"http://image",
            b"http://page",
            ts::ctx(&mut sc)
        );

        game::burn_game(g);
    }
}