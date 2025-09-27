// tests/game_tests.move
#[test_only]
module game_marketplace::game_tests {
    use std::string;
    use sui::test_scenario as ts;
    use game_marketplace::game;

    const ALICE: address = @0xA11CE;
    const BOB:   address = @0xB0B;

    #[test]
    fun create_game_ok() {
        let mut sc = ts::begin(ALICE);
        ts::next_tx(&mut sc, ALICE);
        game::create_game(b"Nom", b"Description", b"http://image", b"http://page", ts::ctx(&mut sc));
        // Consommer le scénario (pas de drop implicite possible)
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

        let g = game::mk_game_for_test(b"Zelda", b"Aventure", b"http://img", b"http://page", ts::ctx(&mut sc));

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

        let g = game::mk_game_for_test(b"Nom", b"Description", b"http://image", b"http://page", ts::ctx(&mut sc));
        game::transfer_game(g, BOB);

        ts::end(sc);
    }

    #[test]
    fun burn_game_ok() {
        let mut sc = ts::begin(ALICE);
        ts::next_tx(&mut sc, ALICE);

        let g = game::mk_game_for_test(b"Nom", b"Description", b"http://image", b"http://page", ts::ctx(&mut sc));
        game::burn_game(g);

        ts::end(sc);
    }
}