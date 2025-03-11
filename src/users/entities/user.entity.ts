import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
