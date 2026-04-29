import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

interface PokemonListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
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
  types: string[];
}

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private readonly http: HttpClient) {}

  getPokemonList(limit = 20): Observable<PokemonCard[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon`, { params: { limit } })
      .pipe(
        switchMap((response) => {
          const detailRequests = response.results.map((pokemon) =>
            this.http.get<PokemonDetailResponse>(pokemon.url),
          );
          return forkJoin(detailRequests);
        }),
        map((details) =>
          details.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
          })),
        ),
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
        types: pokemon.types.map((entry) => entry.type.name),
      })),
    );
  }
}
