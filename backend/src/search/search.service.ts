import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from 'src/listing/entities/listing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  searchListings({
    query,
    type,
    city,
    district,
    minPrice,
    maxPrice,
    sortByPrice,
  }: {
    query: string;
    type?: string;
    city?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    sortByPrice?: 'asc' | 'desc';
  }): Promise<Listing[]> {
    let queryBuilder = this.listingRepository.createQueryBuilder('listing');
    console.log(query);

    if (query) {
      const searchWords = query.split(' ').filter((word) => word.trim() !== '');
      if (searchWords.length > 0) {
        queryBuilder = queryBuilder.where(
          `(${searchWords.map((word, index) => `listing.title ILIKE :word${index} OR listing.description ILIKE :word${index}`).join(' OR ')})`,
          searchWords.reduce(
            (acc, word, index) => ({ ...acc, [`word${index}`]: `%${word}%` }),
            {},
          ),
        );
      }
    }

    if (type) {
      queryBuilder = queryBuilder.andWhere('listing.type = :type', { type });
    }
    if (city) {
      queryBuilder = queryBuilder.andWhere('listing.city = :city', { city });
    }
    if (district) {
      queryBuilder = queryBuilder.andWhere('listing.district = :district', {
        district,
      });
    }
    if (minPrice) {
      queryBuilder = queryBuilder.andWhere('listing.price >= :minPrice', {
        minPrice,
      });
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.andWhere('listing.price <= :maxPrice', {
        maxPrice,
      });
    }
    if (sortByPrice === 'asc') {
      queryBuilder = queryBuilder.orderBy('listing.price', 'ASC');
    } else if (sortByPrice === 'desc') {
      queryBuilder = queryBuilder.orderBy('listing.price', 'DESC');
    }

    return queryBuilder.getMany();
  }
}
