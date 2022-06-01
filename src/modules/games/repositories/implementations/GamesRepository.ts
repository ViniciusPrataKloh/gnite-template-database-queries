import { getRepository, Repository } from 'typeorm';
import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';
import { IGamesRepository } from '../IGamesRepository';



export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const game = await this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) ILIKE LOWER(:param)", { param: `%${param}%` })
      .getMany();
    return game;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(*) from games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("users_games_games")
      .relation(Game, 'users')
      .of(id)
      .loadMany();
  }
}
