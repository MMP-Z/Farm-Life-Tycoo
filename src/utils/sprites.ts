// Sprout Lands art integration — pixel-art sprite registry.
// Base sprites: Cup Nooble "Sprout Lands - Sprites - Basic pack" (see public/assets/CREDITS.md).
// Carrot = palette-swapped beet; corn/tomato/pumpkin/strawberry mid+mature+item,
// duck/pig/sheep/goat/dog/fox, all product items, portraits and mood faces were
// drawn in the same 16px style (the pack license permits style-matched additions).

export interface CropSprites {
  seed: string;
  sprout: string;
  mid: string;
  mature: string;
  item: string;
}

const C = (n: string) => `/assets/crops/${n}.png`;
const I = (n: string) => `/assets/items/${n}.png`;
const A = (n: string) => `/assets/animals/${n}.png`;
const P = (n: string) => `/assets/portraits/${n}.png`;
const M = (n: string) => `/assets/moods/${n}.png`;

export const SPROUT_SPRITE = C('sprout');
export const COIN_SPRITE = I('coin');
export const FARMER_SPRITE = '/assets/farmer.png';

export const CROP_SPRITES: Record<string, CropSprites> = {
  wheat:      { seed: C('wheat_seed'),  sprout: SPROUT_SPRITE, mid: C('wheat_mid'),      mature: C('wheat_mature'),      item: C('wheat_item') },
  carrot:     { seed: C('carrot_seed'), sprout: SPROUT_SPRITE, mid: C('carrot_mid'),     mature: C('carrot_mature'),     item: C('carrot_item') },
  corn:       { seed: C('wheat_seed'),  sprout: SPROUT_SPRITE, mid: C('corn_mid'),       mature: C('corn_mature'),       item: C('corn_item') },
  tomato:     { seed: C('carrot_seed'), sprout: SPROUT_SPRITE, mid: C('tomato_mid'),     mature: C('tomato_mature'),     item: C('tomato_item') },
  pumpkin:    { seed: C('carrot_seed'), sprout: SPROUT_SPRITE, mid: C('pumpkin_mid'),    mature: C('pumpkin_mature'),    item: C('pumpkin_item') },
  strawberry: { seed: C('carrot_seed'), sprout: SPROUT_SPRITE, mid: C('strawberry_mid'), mature: C('strawberry_mature'), item: C('strawberry_item') },
};

/** Growth-stage sprite for a field plot: sprout <35%, mid <75%, mature beyond. */
export function getCropStageSprite(cropId: string, progressPercent: number): string {
  const s = CROP_SPRITES[cropId];
  if (!s) return SPROUT_SPRITE;
  if (progressPercent < 35) return s.sprout;
  if (progressPercent < 75) return s.mid;
  return s.mature;
}

export const ANIMAL_SPRITES: Record<string, string> = {
  chicken: A('chicken'),
  duck: A('duck'),
  cow: A('cow'),
  pig: A('pig'),
  sheep: A('sheep'),
  goat: A('goat'),
  dog: A('dog'),
  fox: A('fox'),
};

/** Product/inventory icons for every item in ALL_ITEMS_CATALOG. */
export const ITEM_SPRITES: Record<string, string> = {
  wheat: C('wheat_item'),
  carrot: C('carrot_item'),
  corn: C('corn_item'),
  tomato: C('tomato_item'),
  pumpkin: C('pumpkin_item'),
  strawberry: C('strawberry_item'),
  wheat_seed: C('wheat_seed'),
  carrot_seed: C('carrot_seed'),
  corn_seed: C('wheat_seed'),
  tomato_seed: C('carrot_seed'),
  pumpkin_seed: C('carrot_seed'),
  strawberry_seed: C('carrot_seed'),
  egg: A('egg'),
  duck_egg: A('egg'),
  milk: I('milk'),
  pork: I('pork'),
  wool: I('wool'),
  honey: I('honey'),
  flour: I('flour'),
  corn_flour: I('corn_flour'),
  bread: I('bread'),
  strawberry_cake: I('strawberry_cake'),
  butter: I('butter'),
  cheese: I('cheese'),
  strawberry_jam: I('strawberry_jam'),
  tomato_sauce: I('tomato_sauce'),
  fertilizer: I('fertilizer'),
  pesticide: I('pesticide'),
  vet_medicine: I('vet_medicine'),
};

/** Starting-profile portraits (NewGameModal, HUD). */
export const PROFILE_SPRITES: Record<string, string> = {
  hardworking_farmer: P('farmer_straw'),
  rancher: P('farmer_cowboy'),
  merchant: P('farmer_tophat'),
  chef: P('farmer_chef'),
  heir: P('farmer_heir'),
};

/** Random-event NPC portraits. */
export const NPC_SPRITES: Record<string, string> = {
  merchant: P('npc_merchant'),
  engineer: P('npc_engineer'),
};

/** Event modal icons (keyed by legacy emoji). */
export const EVENT_ICON_SPRITES: Record<string, string> = {
  '👳‍♂️': P('npc_merchant'),
  '👨‍🔬': P('npc_engineer'),
};

/** Order customer avatars (keyed by legacy emoji). */
export const CUSTOMER_SPRITES: Record<string, string> = {
  '👨‍🌾': P('farmer_straw'),
  '👨‍🍳': P('farmer_chef'),
  '👩‍💼': P('npc_businesswoman'),
  '👧': P('npc_girl'),
};

/** Animal mood faces (PastureTab status). */
export const MOOD_SPRITES = {
  happy: M('happy'),
  neutral: M('neutral'),
  sad: M('sad'),
  sick: M('sick'),
};
