// Sprout Lands art integration — pixel-art sprite registry.
// Base sprites: Cup Nooble "Sprout Lands - Sprites - Basic pack" (see public/assets/CREDITS.md).
// Carrot = palette-swapped beet; corn/tomato/pumpkin/strawberry mid+mature+item and
// duck/pig were drawn in the same 16px style (license permits style-matched additions).

export interface CropSprites {
  seed: string;
  sprout: string;
  mid: string;
  mature: string;
  item: string;
}

const C = (n: string) => `/assets/crops/${n}.png`;
const A = (n: string) => `/assets/animals/${n}.png`;

export const SPROUT_SPRITE = C('sprout');

export const CROP_SPRITES: Record<string, CropSprites> = {
  wheat:      { seed: C('wheat_seed'),      sprout: SPROUT_SPRITE, mid: C('wheat_mid'),      mature: C('wheat_mature'),      item: C('wheat_item') },
  carrot:     { seed: C('carrot_seed'),     sprout: SPROUT_SPRITE, mid: C('carrot_mid'),     mature: C('carrot_mature'),     item: C('carrot_item') },
  corn:       { seed: C('wheat_seed'),      sprout: SPROUT_SPRITE, mid: C('corn_mid'),       mature: C('corn_mature'),       item: C('corn_item') },
  tomato:     { seed: C('carrot_seed'),     sprout: SPROUT_SPRITE, mid: C('tomato_mid'),     mature: C('tomato_mature'),     item: C('tomato_item') },
  pumpkin:    { seed: C('carrot_seed'),     sprout: SPROUT_SPRITE, mid: C('pumpkin_mid'),    mature: C('pumpkin_mature'),    item: C('pumpkin_item') },
  strawberry: { seed: C('carrot_seed'),     sprout: SPROUT_SPRITE, mid: C('strawberry_mid'), mature: C('strawberry_mature'), item: C('strawberry_item') },
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
};

/** Product/inventory icons: harvested crops + animal products covered by the pack. */
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
};

export const FARMER_SPRITE = '/assets/farmer.png';
