import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokeApiService, PokemonDetail } from '../../app/poke-api.service';
import pokemonTypes from '../../constants/pokemon-types.json';

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pokeApiService = inject(PokeApiService);
  private readonly typeColors = pokemonTypes as Record<string, string>;

  readonly pokemon = signal<PokemonDetail | null>(null);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  readonly statNames = [
    'hp',
    'attack',
    'defense',
    'special-attack',
    'special-defense',
    'speed',
  ] as const;

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

  getTypeColor(type: string): string {
    return this.typeColors[type] ?? '#1f2937';
  }

  getTypeGradient(): string {
    const types = this.pokemon()?.types ?? [];
    const c1 = types[0] ? this.getTypeColor(types[0]) : '#264A81';
    const c2 = types[1] ? this.getTypeColor(types[1]) : '#478FB3';
    return `linear-gradient(to bottom, ${c1}, ${c2})`;
  }

  formatHeight(heightDecimeters: number): string {
    // PokeAPI: height in decimeters (dm)
    return `${(heightDecimeters / 10).toFixed(1)} m`;
  }

  formatWeight(weightHectograms: number): string {
    // PokeAPI: weight in hectograms (hg)
    return `${(weightHectograms / 10).toFixed(1)} kg`;
  }

  getStatValue(statName: string): number {
    return this.pokemon()?.stats.find((s) => s.name === statName)?.value ?? 0;
  }

  getStatPercent(statName: string): number {
    const value = this.getStatValue(statName);
    // base_stat typically 0..255; normalizamos para que el bar no sea demasiado pequeño
    return Math.max(0, Math.min(100, Math.round((value / 255) * 100)));
  }

  formatStatLabel(statName: string): string {
    return statName
      .replaceAll('-', ' ')
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ');
  }
}
