import { Injectable } from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokeApiResponse } from './interfaces/pokemons.response';
import { PokeApiPokemonReponse } from './interfaces/pokeapi-pokemon.response';

@Injectable()
export class PokemonsService {
  paginatedPokemonsCached = new Map<string, Pokemon[]>();

  create(createPokemonDto: CreatePokemonDto) {
    return 'This action adds a new pokemon';
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit = 10, page = 1 } = paginationDto;
    const cacheKey = `${limit}-${page}`;
    if (this.paginatedPokemonsCached.has(cacheKey)) {
      return this.paginatedPokemonsCached.get(cacheKey)!;
    }
    const offset = (page - 1) * limit;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = (await response.json()) as PokeApiResponse;
    const pokemonPromises = data.results.map((result) => {
      const url = result.url;
      const id = url.split('/').at(-2)!;
      return this.getInformationPokemon(+id);
    });
    const pokemons = await Promise.all(pokemonPromises);
    this.paginatedPokemonsCached.set(cacheKey, pokemons);
    return pokemons;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private async getInformationPokemon(id: number): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = (await response.json()) as PokeApiPokemonReponse;
    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
