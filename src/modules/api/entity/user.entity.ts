  import {
      PrimaryGeneratedColumn,
      Column,
      CreateDateColumn,
      BeforeInsert,
      BeforeUpdate,
      Entity,
      OneToOne,
    } from 'typeorm';
  import { hash } from 'bcryptjs';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    user_id: number;
  
    @Column({ type: 'varchar', length: 255, default: '', nullable: true })
    user_name: string;
  
    @Column({ type: 'decimal', nullable: false })
    user_money: number;
  
    @Column({ type: 'varchar', length: 128, nullable: false, select: false })
    password: string;
  
    @CreateDateColumn({ name: 'last_time', type: 'timestamp' })
    lastTime: Date;
  
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (!this.password) {
        return;
      }
      this.password = await hash(this.password, 10);
    }
  

  }