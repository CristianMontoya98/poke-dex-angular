import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

interface PokemonListResponse {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonListPage {
  items: PokemonCard[];
  totalCount: number;
  limit: number;
  offset: number;
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string | null;
  };
}

export interface PokemonCard {
  id: number;
  name: string;
  image: string | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string | null;
  height: number;
  weight: number;
  baseExperience: number;
  abilities: string[];
  stats: Array<{
    name: string;
    value: number;
  }>;
  types: string[];
}

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private readonly http: HttpClient) {}

  getPokemonList(limit = 10, offset = 0): Observable<PokemonListPage> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon`, {
        params: { limit, offset },
      })
      .pipe(
        switchMap((response) => {
          if (response.results.length === 0) {
            return of({
              items: [] as PokemonCard[],
              totalCount: response.count,
              limit,
              offset,
            });
          }

          const detailRequests = response.results.map((pokemon) =>
            this.http.get<PokemonDetailResponse>(pokemon.url),
          );

          return forkJoin(detailRequests).pipe(
            map((details) => ({
              items: details.map((pokemon) => ({
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.front_default,
              })),
              totalCount: response.count,
              limit,
              offset,
            })),
          );
        }),
      );
  }

  getPokemonById(id: number | string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetailResponse>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
        height: pokemon.height,
        weight: pokemon.weight,
        baseExperience: pokemon.base_experience,
        abilities: pokemon.abilities.map((a) => a.ability.name),
        stats: pokemon.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        types: pokemon.types.map((entry) => entry.type.name),
      })),
    );
  }
}
