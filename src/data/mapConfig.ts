// Map configurations for each region
import vilaDosDadosMap from '@/assets/maps/vila-dos-dados-map.jpg';
import cidadeConectadaMap from '@/assets/maps/cidade-conectada-map.jpg';
import reinoCloudMap from '@/assets/maps/reino-cloud-map.jpg';
import florestaServidoresMap from '@/assets/maps/floresta-servidores-map.jpg';
import castelosFirewallMap from '@/assets/maps/castelos-firewall-map.jpg';
import lagoAutenticacaoMap from '@/assets/maps/lago-autenticacao-map.jpg';
import darkWebDungeonMap from '@/assets/maps/dark-web-dungeon-map.jpg';

export interface MapConfig {
  id: string;
  background: string;
  width: number;
  height: number;
}

export const regionMaps: Record<string, MapConfig> = {
  'vila-dos-dados': {
    id: 'vila-dos-dados',
    background: vilaDosDadosMap,
    width: 1920,
    height: 1080,
  },
  'cidade-conectada': {
    id: 'cidade-conectada',
    background: cidadeConectadaMap,
    width: 1920,
    height: 1080,
  },
  'reino-da-cloud': {
    id: 'reino-da-cloud',
    background: reinoCloudMap,
    width: 1920,
    height: 1080,
  },
  'florestas-de-servidores': {
    id: 'florestas-de-servidores',
    background: florestaServidoresMap,
    width: 1920,
    height: 1080,
  },
  'castelos-de-firewall': {
    id: 'castelos-de-firewall',
    background: castelosFirewallMap,
    width: 1920,
    height: 1080,
  },
  'lago-da-autenticacao': {
    id: 'lago-da-autenticacao',
    background: lagoAutenticacaoMap,
    width: 1920,
    height: 1080,
  },
  'dark-web-dungeon': {
    id: 'dark-web-dungeon',
    background: darkWebDungeonMap,
    width: 1920,
    height: 1080,
  },
};

export const getMapForRegion = (regionId: string): MapConfig => {
  return regionMaps[regionId] || regionMaps['vila-dos-dados'];
};
