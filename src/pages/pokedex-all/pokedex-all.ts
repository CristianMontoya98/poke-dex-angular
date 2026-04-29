import { Component, OnInit, inject, signal } from '@angular/core';
import { PokeApiService, PokemonCard } from '../../app/poke-api.service';
import { Card } from '../../components/card/card';

@Component({
  selector: 'app-pokedex-all',
  imports: [Card],
  templateUrl: './pokedex-all.html',
  styleUrl: './pokedex-all.scss',
})
export class PokedexAll implements OnInit {
  private readonly pokeApiService = inject(PokeApiService);

  readonly pokemons = signal<PokemonCard[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  ngOnInit(): void {
    this.getPokemon();
  }
  getPokemon(){
    this.pokeApiService.getPokemonList().subscribe({
      next: (data) => {
        this.pokemons.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
