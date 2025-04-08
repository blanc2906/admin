import { Injectable, OnModuleInit } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly needModels: Prisma.ModelName[] = [
    'Estate',
    'EstateArea',
    'Device',
    'User',
    'AdminAccount',
  ];
  private isRestore = false;
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (this.needModels.includes(params.model)) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          if (!params.args) {
            params.args = {};
          }
          if (!params.args.where) {
            params.args.where = {};
          }
          if (!this.isRestore && !params.args.where.deletedAt) {
            params.args.where = {
              ...params.args.where,
              deletedAt: null,
            };
          }
        }
        if (
          params.action === 'findFirstOrThrow' ||
          params.action === 'findUniqueOrThrow'
        ) {
          if (!params.args) {
            params.args = {};
          }
          if (!params.args.where) {
            params.args.where = {};
          }
          if (params.args.where.deletedAt == undefined) {
            // Exclude deletedAt records if they have not been explicitly requested
            params.args.where['deletedAt'] = null;
          }
        }
        if (params.action === 'findMany') {
          if (!params.args) {
            params.args = {};
          }
          if (!params.args.where) {
            params.args.where = {};
          }
          if (!this.isRestore && params.args.where.deletedAt === undefined) {
            params.args.where = {
              ...params.args.where,
              deletedAt: null,
            };
          }
        }
        if (params.action === 'count') {
          // Count queries
          if (!params.args) {
            params.args = {};
          }
          if (!params.args.where) {
            params.args.where = {};
          }
          if (params.args.where.deletedAt == undefined) {
            params.args.where['deletedAt'] = null;
          }
        }
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      if (this.needModels.includes(params.model)) {
        if (this.needModels.includes(params.model)) {
          if (params.action === 'update') {
            params.action = 'updateMany';
            if (!params.args) {
              params.args = {};
            }
            if (!params.args.where) {
              params.args.where = {};
            }
            if (!this.isRestore && !params.args.where.deletedAt) {
              params.args.where = {
                ...params.args.where,
                deletedAt: null,
              };
            }
          }
          if (params.action === 'updateMany') {
            if (!params.args) {
              params.args = {};
            }
            if (!params.args.where) {
              params.args.where = {};
            }
            if (!this.isRestore && params.args.where.deletedAt === undefined) {
              params.args.where = {
                ...params.args.where,
                deletedAt: null,
              };
            }
          }
        }
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      // Check incoming query type
      if (this.needModels.includes(params.model)) {
        if (params.action == 'delete') {
          // Delete queries
          // Change action to an update
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
        }
        if (params.action == 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deletedAt'] = true;
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
        }
      }
      return next(params);
    });
  }

  //restore
  async restore(model: Prisma.ModelName, where: any) {
    if (!this.needModels.includes(model)) {
      throw new Error(`Model ${model} không hỗ trợ khôi phục`);
    }

    // Tạo mapping cho tên model
    const modelMapping = {
      Estate: 'estate',
      EstateArea: 'estateArea',
      Device: 'device',
      User: 'user',
      AdminAccount: 'adminAccount',
    };
    //flag restore
    this.isRestore = true;
    try {
      const modelName = modelMapping[model];
      if (!modelName) {
        throw new Error(`Model ${model} không tìm thấy mapping`);
      }
      //update deletedAt to null
      return await (this[modelName] as any).updateMany({
        where: {
          ...where,
          deletedAt: {
            not: null,
          },
        },
        data: {
          deletedAt: null,
        },
      });
    } finally {
      this.isRestore = false; //reset flag restore
    }
  }

  async restoreMany(model: Prisma.ModelName, where: any) {
    if (!this.needModels.includes(model)) {
      throw new Error(`Model ${model} không hỗ trợ khôi phục`);
    }
    const modelMapping = {
      Estate: 'estate',
      EstateArea: 'estateArea',
      Device: 'device',
      User: 'user',
      AdminAccount: 'adminAccount',
    };
    this.isRestore = true;
    try {
      const modelName = modelMapping[model];
      if (!modelName) {
        throw new Error(`Model ${model} không tìm thấy mapping`);
      }
      return await (this[modelName] as any).updateMany({
        where: {
          ...where,
          deletedAt: { not: null },
        },
        data: {
          deletedAt: null,
        },
      });
    } finally {
      this.isRestore = false;
    }
  }
}
