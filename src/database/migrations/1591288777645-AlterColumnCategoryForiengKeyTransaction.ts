import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterColumnCategoryForiengKeyTransaction1591288777645
  implements MigrationInterface {
  private categoryNewColumn = new TableColumn({
    name: 'category_id',
    type: 'uuid',
  });

  private categoryOldcolumn = new TableColumn({
    name: 'category',
    type: 'varchar',
  });

  private categoryForeignKey = new TableForeignKey({
    name: 'transactionscategory',
    columnNames: ['category_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'categories',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('transactions', this.categoryOldcolumn);
    await queryRunner.addColumn('transactions', this.categoryNewColumn);
    await queryRunner.createForeignKey('transactions', this.categoryForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('transactions', this.categoryForeignKey);
    await queryRunner.dropColumn('transactions', this.categoryNewColumn);
    await queryRunner.addColumn('transactions', this.categoryOldcolumn);
  }
}
