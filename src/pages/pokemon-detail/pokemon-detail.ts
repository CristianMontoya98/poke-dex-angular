import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokeApiService, PokemonDetail } from '../../app/poke-api.service';

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pokeApiService = inject(PokeApiService);

  readonly pokemon = signal<PokemonDetail | null>(null);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.hasError.set(true);
      this.isLoading.set(false);
      return;
    }

    this.pokeApiService.getPokemonById(id).subscribe({
      next: (pokemon) => {
        this.pokemon.set(pokemon);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
