import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

  readonly pageSize = 10;
  readonly skeletonSlots = Array.from({ length: 10 }, (_, index) => index);
  readonly pokemons = signal<PokemonCard[]>([]);
  readonly currentPage = signal(1);
  readonly totalCount = signal(0);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize)),
  );

  readonly canGoPrevious = computed(() => this.currentPage() > 1);
  readonly canGoNext = computed(() => this.currentPage() < this.totalPages());

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const offset = (page - 1) * this.pageSize;

    this.pokeApiService.getPokemonList(this.pageSize, offset).subscribe({
      next: (data) => {
        this.pokemons.set(data.items);
        this.totalCount.set(data.totalCount);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.loadPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.loadPage(this.currentPage() + 1);
    }
  }
}
