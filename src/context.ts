import * as Express from 'express';
import * as DataLoader from 'dataloader';

import { models } from 'models';
import { AuthorRepository } from './repositories/author.repository';
import { BookRepository } from './repositories/book.repository';

import { Logger } from './core/logger';
const log = Logger('app:Context');


interface IContextLoaders {
    author: DataLoader<number, models.author.Attributes>;
    book: DataLoader<number, models.book.Attributes>;
}

interface IContextRepos {
    author: AuthorRepository;
    book: BookRepository;
}


export class Context {

    public repos: IContextRepos = <IContextRepos>{};
    public loaders: IContextLoaders = <IContextLoaders>{};

    constructor(
        private request: Express.Request,
        public repsonse: Express.Response
    ) { }

    public hasUserRoles(roles: string[]): boolean {
        // TODO: Here you should check if the user as the needed roles for the requested query
        return true;
    }

    public get getLanguage() {
        return this.request.acceptsLanguages();
    }

    public setAuthorRepository(authorRepository: AuthorRepository): Context {
        this.repos.author = authorRepository;
        this.loaders.author = new DataLoader((ids: number[]) => this.repos.author.findAuthorsByIds(ids));
        log.debug('setAuthorRepository');
        return this;
    }

    public setBookRepository(bookRepository: BookRepository): Context {
        this.repos.book = bookRepository;
        this.loaders.book = new DataLoader((ids: number[]) => this.repos.book.findBooksByIds(ids));
        log.debug('setBookRepository');
        return this;
    }

}
