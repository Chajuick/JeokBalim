import type { ComponentType } from 'react'
import type { Poem } from '@/lib/poems'

import DefaultScene from '@/components/poem-scenes/DefaultScene'
import LightScene from '@/components/poem-scenes/LightScene'
import RainScene from '@/components/poem-scenes/RainScene'
import SteamScene from '@/components/poem-scenes/SteamScene'
import MoonScene from '@/components/poem-scenes/MoonScene'
import WeaponScene from '@/components/poem-scenes/WeaponScene'
import WindowTreeScene from '@/components/poem-scenes/WindowTreeScene'
import BoiledEggScene from '@/components/poem-scenes/BoiledEggScene'

export const poemSceneMap: Record<string, ComponentType<{ poem: Poem }>> = {
  '001': LightScene,
  '002': RainScene,
  '003': SteamScene,
  '004': MoonScene,
  '005': WeaponScene,
  '006': WindowTreeScene,
  '007': BoiledEggScene,
}

export { DefaultScene }