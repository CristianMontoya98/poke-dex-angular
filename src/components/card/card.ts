import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonCard } from '../../app/poke-api.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() pokemon: PokemonCard | null = null;
}
