import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('simple-array')
  tags: string[];

  @Column({ default: true })
  isPublic: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
