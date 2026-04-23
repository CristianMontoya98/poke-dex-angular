import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexAll } from './pokedex-all';

describe('PokedexAll', () => {
  let component: PokedexAll;
  let fixture: ComponentFixture<PokedexAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexAll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexAll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
