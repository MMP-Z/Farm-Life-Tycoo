import React from 'react';
import {
  Sparkles, Gem, Truck, Package, House, Shield, ScrollText, CookingPot, Tractor,
  FlaskConical, Droplet, CloudRain, Flower2, Sun, AlertTriangle, Lock, Settings,
  Star, Briefcase, ClipboardList, Store, Building2, Rainbow, Trophy, Pill,
  ShoppingCart, Zap, Syringe, CupSoda, CloudLightning, Cloud, Tornado, Waves,
  Umbrella, Mountain, Salad, PartyPopper, Dices, CircleHelp, Target, Map as MapIcon,
  MapPin, Microscope, Tent, Mail, Bug, Skull, ArrowRight, ShoppingBasket, Handshake,
  Landmark, TrendingUp, Scale, Flame, Snowflake, Leaf, Factory, Megaphone, BrickWall, Timer,
  type LucideIcon,
} from 'lucide-react';
import { SpriteIcon } from './SpriteIcon';
import { ITEM_SPRITES, ANIMAL_SPRITES, CROP_SPRITES, MOOD_SPRITES } from '../utils/sprites';

/**
 * Universal game icon: pass an emoji character, get back the pixel-art sprite
 * or Lucide icon that replaces it. Sizes in em so it inherits the parent's
 * font size (wrap in a text-xl/text-2xl span as before).
 *
 * Goal: zero emoji rendered anywhere in the game UI.
 */

// Emoji → sprite image
const SPRITE_MAP: Record<string, string> = {
  '👨‍🌾': '/assets/portraits/farmer_straw.png',
  '🧑‍🌾': '/assets/portraits/farmer_straw.png',
  '🌾': ITEM_SPRITES.wheat,
  '🌱': CROP_SPRITES.wheat.sprout,
  '🌿': CROP_SPRITES.wheat.mid,
  '🌽': ITEM_SPRITES.corn,
  '🥕': ITEM_SPRITES.carrot,
  '🍓': ITEM_SPRITES.strawberry,
  '🍅': ITEM_SPRITES.tomato,
  '🎃': ITEM_SPRITES.pumpkin,
  '🥚': ITEM_SPRITES.egg,
  '🥛': ITEM_SPRITES.milk,
  '🧀': ITEM_SPRITES.cheese,
  '🍞': ITEM_SPRITES.bread,
  '🍰': ITEM_SPRITES.strawberry_cake,
  '🧈': ITEM_SPRITES.butter,
  '🥫': ITEM_SPRITES.tomato_sauce,
  '🥩': ITEM_SPRITES.pork,
  '🍯': ITEM_SPRITES.honey,
  '🧶': ITEM_SPRITES.wool,
  '🧴': ITEM_SPRITES.pesticide,
  '🧪': ITEM_SPRITES.fertilizer,
  '💊': ITEM_SPRITES.vet_medicine,
  '🍄': '/assets/items/mushroom.png',
  '🥧': '/assets/items/cornbread.png',
  '🧃': '/assets/items/tomato_juice.png',
  '🍁': '/assets/items/autumn_leaf.png',
  '🐮': ANIMAL_SPRITES.cow,
  '🐄': ANIMAL_SPRITES.cow,
  '🐂': ANIMAL_SPRITES.cow,
  '🐔': ANIMAL_SPRITES.chicken,
  '🐷': ANIMAL_SPRITES.pig,
  '🦆': ANIMAL_SPRITES.duck,
  '🐑': ANIMAL_SPRITES.sheep,
  '🐐': ANIMAL_SPRITES.goat,
  '🐕': ANIMAL_SPRITES.dog,
  '🦊': ANIMAL_SPRITES.fox,
  '😊': MOOD_SPRITES.happy,
  '😐': MOOD_SPRITES.neutral,
  '🥺': MOOD_SPRITES.sad,
  '🤒': MOOD_SPRITES.sick,
};

// Emoji → Lucide icon (abstract UI concepts)
const LUCIDE_MAP: Record<string, LucideIcon> = {
  '✨': Sparkles,
  '💎': Gem,
  '🚚': Truck,
  '📦': Package,
  '🏡': House,
  '🛡': Shield,
  '📜': ScrollText,
  '🍳': CookingPot,
  '🚜': Tractor,
  '💧': Droplet,
  '🌧': CloudRain,
  '🌸': Flower2,
  '☀': Sun,
  '⚠': AlertTriangle,
  '🔒': Lock,
  '⚙': Settings,
  '⭐': Star,
  '💼': Briefcase,
  '📋': ClipboardList,
  '🏪': Store,
  '🏙': Building2,
  '🌈': Rainbow,
  '🏆': Trophy,
  '🛒': ShoppingCart,
  '⚡': Zap,
  '💉': Syringe,
  '🥤': CupSoda,
  '⛈': CloudLightning,
  '🌩': CloudLightning,
  '☁': Cloud,
  '🌪': Tornado,
  '🌊': Waves,
  '🏖': Umbrella,
  '🧱': BrickWall,
  '⛰': Mountain,
  '🥗': Salad,
  '🎉': PartyPopper,
  '🎲': Dices,
  '❓': CircleHelp,
  '🎯': Target,
  '🗺': MapIcon,
  '📍': MapPin,
  '🔬': Microscope,
  '🎪': Tent,
  '💌': Mail,
  '🐛': Bug,
  '💀': Skull,
  '➔': ArrowRight,
  '🧺': ShoppingBasket,
  '🤝': Handshake,
  '🏛': Landmark,
  '📈': TrendingUp,
  '⚖': Scale,
  '🔥': Flame,
  '❄': Snowflake,
  '🥖': Factory,
  '🥬': Leaf,
  '🍃': Leaf,
  '📢': Megaphone,
  '🏗': Factory,
  '⏱️': Timer,
  '⏱': Timer,
};

interface Props {
  /** the emoji character being replaced */
  e: string | undefined;
  className?: string;
}

export const GameIcon: React.FC<Props> = ({ e, className = '' }) => {
  if (!e) return null;
  // Normalize: strip variation selectors (U+FE0F) so '🏖️' matches '🏖'
  const key = e.replace(/\uFE0F/g, '');
  const src = SPRITE_MAP[key];
  if (src) {
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        className={`inline-block align-[-0.15em] select-none ${className}`}
        style={{ width: '1.25em', height: '1.25em', objectFit: 'contain', imageRendering: 'pixelated' }}
      />
    );
  }
  const L = LUCIDE_MAP[key];
  if (L) {
    return <L className={`inline-block align-[-0.15em] ${className}`} style={{ width: '1.15em', height: '1.15em' }} />;
  }
  // Unmapped: render as-is (should not happen; keeps UI from breaking)
  return <span className={className}>{e}</span>;
};
