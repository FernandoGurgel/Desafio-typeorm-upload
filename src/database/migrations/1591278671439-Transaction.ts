import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class Transaction1591278671439 implements MigrationInterface {
  private transactionTable = new Table({
    name: 'transactions',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'title',
        type: 'varchar',
      },
      {
        name: 'value',
        type: 'float4',
      },
      {
        name: 'type',
        type: 'varchar',
      },
      {
        name: 'category',
        type: 'varchar',
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(this.transactionTable);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(this.transactionTable);
  }
}
