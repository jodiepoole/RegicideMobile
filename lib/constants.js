export const PHASE_SETUP = "SETUP";
export const PHASE_PLAY = "PLAY";
export const PHASE_DISCARD = "DISCARD";

export const SPADES = "SPADES";
export const CLUBS = "CLUBS";
export const DIAMONDS = "DIAMONDS";
export const HEARTS = "HEARTS";
export const SUITS = [SPADES, CLUBS, DIAMONDS, HEARTS];

export const JACK = "JACK";
export const QUEEN = "QUEEN";
export const KING = "KING";
//RBO Since we're using stack data structure
export const ENEMIES = [KING, QUEEN, JACK];

export const TAVERN_SUIT_CARDS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const CARD_SELECTED_PLAY = "#66ff00";
export const CARD_SELECTED_DISCARD = "#FF0000";

//GAME VARIABLES
export const ANIMAL_COMPANION = 1;
export const CLUBS_DAMAGE_MODIFIER = 2;
export const HAND_LIMIT = 8;

export const JACK_DAMAGE = 10;
export const JACK_HEALTH = 20;

export const QUEEN_DAMAGE = 15;
export const QUEEN_HEALTH = 30;

export const KING_DAMAGE = 20;
export const KING_HEALTH = 40;

export const BOSS_DAMAGE = {
    [JACK] : JACK_DAMAGE,
    [QUEEN]: QUEEN_DAMAGE,
    [KING]: KING_DAMAGE
}

export const BOSS_HEALTH = {
    [JACK] : JACK_HEALTH,
    [QUEEN]: QUEEN_HEALTH,
    [KING]: KING_HEALTH
}
